const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const https = require('http');
const fs = require('fs');
const WebSocket = require("ws");

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS); //
// const serviceAccount = require('./credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bauzarqa.firebaseapp.com',
    firestore: { ignoreUndefinedProperties: true },
    storageBucket: "bauzarqa.appspot.com"
});

const db = admin.firestore();

const indexRoute = require('./routes/index');
const dbRoute = require('./routes/db');
const controlPanelRoute = require('./routes/control-panel');

const app = express();

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const server = https.createServer(options, app);
const wss = new WebSocket.Server({ server }); //
// const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (content) => {
        try {
            const data = JSON.parse(content);
            const { user, name, message, chatId } = data;

            if (!user || !name || (name !== user.name && name !== 'Anonymous') || !user.name || !user.uniId) {
                return ws.send(JSON.stringify({ error: "Invalid user data" }));
            }

            const userQuery = await db.collection("users")
                .where("name", "==", user.name)
                .where("uniId", "==", user.uniId)
                .limit(1)
                .get();

            if (userQuery.empty) {
                return ws.send(JSON.stringify({ error: "Unauthorized user" }));
            }

            if (!name || (name !== user.name && name !== "Anonymous") || !message || !chatId) {
                return ws.send(JSON.stringify({ error: "Invalid message data" }));
            }

            const userDoc = userQuery.docs[0];
            const userRef = userDoc.ref;

            const userData = userDoc.data();
            const credited = userData.credited || [];

            if (!credited.includes(chatId)) {
                await userRef.update({
                    credits: (userData.credits || 0) + 3,
                    credited: [...credited, chatId]
                });
            }

            // Store message in the chat collection
            const chatRef = db.collection("chats").doc(chatId).collection("messages").doc();
            await chatRef.set({
                id: chatRef.id,
                name,
                message,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Broadcast message to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ chatId, name, message }));
                }
            });

        } catch (error) {
            console.error("Error handling message:", error);
            ws.send(JSON.stringify({ error: "Server error occurred" }));
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    req.db = db;
    next();
});

const admins = ['32217030050', '32217030157', '32217030131', '32217036081', '32217030137'];
const hbs = handlebars.create({
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers: {
        eq: (a, b) => a === b,
        json: function (context) {
            return JSON.stringify(context);
        },
        isAdmin: function (uniId, options) {
            if (admins.includes(uniId)) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    },
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'generated_cvs')));
app.use(express.static(path.join(__dirname, 'generated_books')));

app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SESSION_SECRET, //
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, httpOnly: true, sameSite: 'strict', maxAge: 1000 * 60 * 30 }, //
    })
);

app.use(flash());

app.use('/', indexRoute);
app.use('/db', dbRoute);
app.use('/control-panel', controlPanelRoute);

server.listen(3000, () => console.log('HTTPS Server running on port 3000'));
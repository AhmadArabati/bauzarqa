const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS); // When upload the project on https add key name it GOOGLE_APPLICATION_CREDENTIALS in env // google will disable any public key so in env will be a secret file
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bauzarqa.firebaseapp.com',
    firestore: { ignoreUndefinedProperties: true },
    storageBucket: "bauzarqa.appspot.com"
});

const db = admin.firestore();

const indexRoute = require('./routes/index');
const dbRoute = require('./routes/db');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    req.db = db;
    next();
});

const hbs = handlebars.create({
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers: {
        eq: (a, b) => a === b,
        json: function (context) {
            return JSON.stringify(context);
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

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, httpOnly: true, sameSite: 'strict', maxAge: 1000 * 60 * 30 },
    })
);

app.use(flash());

app.use('/', indexRoute);
app.use('/db', dbRoute);

app.listen(3000, () => console.log('HTTPS Server running on port 3000'));

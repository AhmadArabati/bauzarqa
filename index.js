const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');

const serviceAccount = require('./credentials.json');
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
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use('/', indexRoute);
app.use('/db', dbRoute);

app.listen(3000, () => console.log('HTTPS Server running on port 3000'));
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dguwmbpb1',
    api_key: '414471397375342',
    api_secret: 'UCD6QBPUfFUcvGrdD_XLJ_75G1U'
});

const db = admin.firestore();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

const loggedOut = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

const loggedIn = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/user/sign-up');
    }
    next();
};

function throwError(req, res, msg, url, add) {
    req.flash('error', msg);

    if (add) {
        req.flash('add', true);
    }

    res.redirect(url);
}

router.post('/user/sign-up', loggedOut, upload.single('uniCard'), async (req, res) => {
    const { name, uniId, phone, password } = req.body;

    if (!name || name.length > 20 || !uniId || uniId.length > 11 || !phone || phone.length > 10 || !password || password.length > 20) {
        return throwError(req, res, `Something went wrong!`, '/user/sign-up/#error');
    }

    const uniCard = req.file;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userQuery = await db.collection('users')
            .where('uniId', '==', uniId)
            .limit(1)
            .get();

        if (!userQuery.empty) {
            return throwError(req, res, `User ${uniId} already exists`, '/user/sign-up/#error', true);
        }

        const phoneQuery = await db.collection('users')
            .where('phone', '==', phone)
            .limit(1)
            .get();

        if (!phoneQuery.empty) {
            return throwError(req, res, `phone number ${phone} already in use`, '/user/sign-up/#error',);
        }

        cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            async (error, result) => {
                if (error) {
                    return throwError(req, res, `Something went wrong!`, '/user/sign-up/#error');
                }

                const imageUrl = result.secure_url;

                try {
                    const newUserRef = db.collection('users').doc();
                    await newUserRef.set({
                        name: name,
                        uniId: uniId,
                        phone: phone,
                        password: hashedPassword,
                        uniCard: imageUrl,
                        verified: false,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    res.redirect('/user/sign-in');
                } catch (error) {
                    console.error('Error registering user: ', error);
                    return throwError(req, res, `Something went wrong!`, '/user/sign-up/#error');
                }
            }
        ).end(uniCard.buffer);
    } catch (error) {
        console.error('Error checking user existence: ', error);
        return throwError(req, res, `Something went wrong!`, '/user/sign-up/#error');
    }
});

router.post('/user/sign-in', loggedOut, async (req, res) => {
    const { uniId, password } = req.body;

    if (!uniId || uniId.length > 11 || !password || password.length > 20) {
        return throwError(req, res, `Something went wrong!`, '/user/sign-in/#error');
    }

    try {
        const userRef = db.collection('users')
            .where('uniId', '==', uniId);

        const userSnapshot = await userRef.get();

        if (userSnapshot.empty) {
            return throwError(req, res, `${uniId} is not registered!`, '/user/sign-in/#error', true);
        }

        const userData = userSnapshot.docs[0].data();

        if (!userData.verified) {
            return throwError(req, res, `${uniId} is not verified yet.`, '/user/sign-in/#error');
        }

        const storedPassword = userData.password;
        const isMatch = await bcrypt.compare(password, storedPassword);
        if (!isMatch) {
            return throwError(req, res, `Wrong password!`, '/user/sign-in/#error');
        }

        req.session.user = {
            name: userData.name,
            uniId: userData.uniId,
            phone: userData.phone,
            uniCard: userData.uniCard,
        };

        res.redirect('/');
    } catch (error) {
        console.error('Error signing in user:', error);
        return throwError(req, res, `Something went wrong!`, '/user/sign-in/#error');
    }
});

router.post("/add-book", loggedIn, async (req, res) => {
    const user = req.session.user;
    try {
        const { type, title, description, price } = req.body;

        if (!type || (type !== 'Free' && type !== 'Paid') || !title || title.length > 20 || !description || description.length > 60 || !price || (type === 'Paid' && (Number(price) <= 0 || Number(price) > 100 || isNaN(Number(price))))) {
            return throwError(req, res, `Something went wrong!`, '/services/book-exchange/#error');
        }

        const newBookRef = db.collection("books").doc();

        await newBookRef.set({
            id: newBookRef.id,
            uid: user.uniId,
            type,
            title,
            description,
            price: type === "Free" ? "Free" : `${price} JD`,
            phone: user.phone,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            done: false
        });

        return throwError(req, res, `Book added successfully!`, '/services/book-exchange/#error');
    } catch (error) {
        console.error("Error adding book:", error);
        return throwError(req, res, `Something went wrong!`, '/services/book-exchange/#error');
    }
});

router.get("/get-books", loggedIn, async (req, res) => {
    try {
        const booksSnapshot = await db.collection("books").orderBy("createdAt", "desc").get();
        const books = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        return throwError(req, res, `Error getting books!`, '/services/book-exchange/#error');
    }
});

router.post("/done-book", loggedIn, async (req, res) => {
    const { uniId, uid, id } = req.body;

    try {
        if (uniId !== uid) {
            return throwError(req, res, `Something went wrong!`, '/services/book-exchange/#error');
        }

        const bookRef = db.collection("books").doc(id);
        const bookSnapshot = await bookRef.get();

        if (!bookSnapshot.exists) {
            return throwError(req, res, `Something went wrong!`, '/services/book-exchange/#error');
        }

        await bookRef.update({ done: true });

        return throwError(req, res, `Deal marked as done!`, '/services/book-exchange/#error');
    } catch (error) {
        console.error("Error updating book status:", error);
        return throwError(req, res, `Something went wrong!`, '/services/book-exchange/#error');
    }
});

module.exports = router;
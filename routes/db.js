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

router.post('/user/sign-up', loggedOut, upload.single('uniCard'), async (req, res) => {
    const { name, uniId, phone, password } = req.body;
    const uniCard = req.file;

    if (!uniCard) {
        return res.status(400).send('No file uploaded');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            async (error, result) => {
                if (error) {
                    return res.status(500).send('Error uploading image to Cloudinary');
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
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    res.redirect('/user/sign-in');
                } catch (error) {
                    console.error('Error registering user: ', error);
                    res.status(500).send('Error registering user');
                }
            }
        ).end(uniCard.buffer);
    } catch (error) {
        console.error('Error uploading image to Cloudinary: ', error);
        res.status(500).send('Error uploading image to Cloudinary');
    }
});

router.post('/user/sign-in', loggedOut, async (req, res) => {
    const { name, uniId, password } = req.body;

    try {
        const userRef = db.collection('users')
            .where('name', '==', name)
            .where('uniId', '==', uniId);
        
        const userSnapshot = await userRef.get();

        if (userSnapshot.empty) {
            return res.status(400).send('No user found with these credentials');
        }

        const userData = userSnapshot.docs[0].data();
        const storedPassword = userData.password;

        const isMatch = await bcrypt.compare(password, storedPassword);

        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
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
        res.status(500).send('Error signing in user');
    }
});

router.post("/add-book", loggedIn, async (req, res) => {
    const user = req.session.user;
    try {
        const { type, title, description, price } = req.body;

        await db.collection("books").add({
            type,
            title,
            description,
            price: type === "Free" ? "Free" : `${price} JD`,
            phone: user.phone,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({ message: "Book added successfully!" });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Error adding book", error });
    }
});

router.get("/get-books", loggedIn, async (req, res) => {
    try {
        const booksSnapshot = await db.collection("books").orderBy("createdAt", "desc").get();
        const books = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books", error });
    }
});

module.exports = router;
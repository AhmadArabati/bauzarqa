const express = require('express');
const admin = require('firebase-admin');

const db = admin.firestore();
const router = express.Router();

const admins = ['32217030050', '32217030157', '32217030131', '32217036081', '32217030137'];

const isAdmin = (req, res, next) => {
    if (!req.session || !req.session.user || !admins.includes(req.session.user.uniId)) {
        return res.redirect('/user/sign-up');
    }
    next();
};

router.get("/not-verified", isAdmin, async (req, res) => {
    const user = req.session.user;

    try {
        const usersRef = db.collection("users");
        const usersSnapshot = await usersRef
            .where("verified", "==", false)
            .orderBy("createdAt", "desc")
            .get();

        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render('control-panel/not-verified', { title: '- Not Verified Users', user, users });
    } catch (error) {
        console.error("Error fetching not-verified users:", error);
        res.status(500).json({ error: "Error getting not-verified users!" });
    }
});

router.get("/verify-user", isAdmin, async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "User ID is required!" });
    }

    try {
        const userRef = db.collection("users").doc(id);

        await userRef.update({
            verified: true,
            uniCard: admin.firestore.FieldValue.delete()
        });

        res.redirect("/control-panel/not-verified");
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ error: "Error verifying user!" });
    }
});

router.get("/remove-user", isAdmin, async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "User ID is required!" });
    }

    try {
        const userRef = db.collection("users").doc(id);
        await userRef.delete();

        res.redirect("/control-panel/not-verified");
    } catch (error) {
        console.error("Error removing user:", error);
        res.status(500).json({ error: "Error removing user!" });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const path = require("path");

const db = admin.firestore();

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

router.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index', { title: '- Home page', user });
});

router.get('/privacy-policy', (req, res) => {
    const user = req.session.user;
    res.render('privacy-policy', { title: '- Privacy Policy', user });
});

router.get('/user/sign-up', loggedOut, (req, res) => {
    const error = req.flash('error');
    const add = req.flash('add');
    res.render('user/sign-up', { title: '- Sign Up', error, add });
});

router.get('/user/sign-in', loggedOut, (req, res) => {
    const error = req.flash('error');
    const add = req.flash('add');
    res.render('user/sign-in', { title: '- Sign In', error, add });
});

router.get('/user/sign-out', loggedIn, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

router.get('/user/profile', loggedIn, (req, res) => {
    const user = req.session.user;
    res.render('user/profile', { title: '- Profile', user });
});

router.get('/services', (req, res) => {
    res.redirect('/#our-services');
});

router.get('/services/book-exchange', loggedIn, (req, res) => {
    const user = req.session.user;
    res.render('services/book-exchange', { title: '- Book Exchange', user });
});

// router.get('/services/questions-bank', loggedIn, (req, res) => {
//     const user = req.session.user;
//     res.render('services/questions-bank', { title: '- Questions Bank', user });
// });

router.get('/services/grades-calculator', loggedIn, (req, res) => {
    const user = req.session.user;
    res.render('services/grades-calculator', { title: '- Grades Calculator', user });
});

router.get('/services/ask-and-answer', loggedIn, (req, res) => {
    const user = req.session.user;
    res.render('services/ask-and-answer', { title: '- Ask & Answer', user });
});

router.get("/services/ask-and-answer/:questionId", loggedIn, async (req, res) => {
    const user = req.session.user;
    const { questionId } = req.params;

    try {
        const questionDoc = await db.collection("questions").doc(questionId).get();

        if (!questionDoc.exists) {
            return throwError(req, res, `Something went wrong!`, '/services/ask-and-answer/#error');
        }

        const data = questionDoc.data();
        res.render('services/chat', { title: '- Chat By ' + data.name, user, chat: { id: questionId, owner: data.name, title: data.title, description: data.description } });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return throwError(req, res, `Something went wrong!`, '/services/ask-and-answer/#error');
    }
});

router.get('/services/whatsapp-groups', loggedIn, (req, res) => {
    const error = req.flash('error');
    const user = req.session.user;
    res.render('services/whatsapp-groups', { title: '- Whatsapp Gropus', user, error });
});

router.get('/services/cv-maker', loggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'layouts', 'services', 'cv-maker.html'));
});

router.get('/services/field-training', loggedIn, (req, res) => {
    const user = req.session.user;
    res.render('services/field-training', { title: '- Field Training', user });
});

router.get('/services/field-training/:major', loggedIn, (req, res) => {
    const { major } = req.params;

    if (major.includes('.html')) {
        major = major.split('.html')[0];
    }

    const majors = [
        'medical-analysis',
        'microbiology',
        'biology'
    ];

    if (majors.includes(major)) {
        res.sendFile(path.join(__dirname, '..', 'views', 'layouts', 'services', 'field-training', 'majors.html'));
    } else {
        res.redirect('./');
    }
});

router.get('/sitemap', (req, res) => {
    res.header('Content-Type', 'application/xml');

    const home = 'https://bauzarqa.onrender.com/';
    const branches = [
        '',
        'user/sign-up',
        'user/sign-in',
        'privacy-policy',
        'services',
        'services/book-exchange',
        'services/questions-bank',
        'services/grades-calculator',
        'services/grades-calculator',
        'services/ask-and-answer',
        'services/whatsapp-groups',
        'services/cv-maker',
        'services/field-training',
        'services/field-training/medical-analysis',
        'services/field-training/microbiology',
        'services/field-training/biology',
    ];

    let urlsets = '';
    branches.forEach(branch => {
        urlsets += `
            <url>
                <loc>${home + branch}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
            </url>
        `;
    })

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urlsets}
        </urlset>
    `;

    res.send(sitemap.trim());
});

module.exports = router;
const express = require('express');
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

router.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index', { title: '- Home page', user });
});

router.get('/privacy-policy', (req, res) => {
    const user = req.session.user;
    res.render('privacy-policy', { title: '- Privacy Policy', user });
});

router.get('/services/book-exchange', loggedIn, (req, res) => {
    const user = req.session.user;
    res.render('services/book-exchange', { title: '- Book Exchange', user });
});

router.get('/user/sign-up', loggedOut, (req, res) => {
    res.render('user/sign-up', { title: '- Sign Up' });
});

router.get('/user/sign-in', loggedOut, (req, res) => {
    res.render('user/sign-in', { title: '- Sign In' });
});

router.get('/user/sign-out', loggedIn, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});











router.get('/urlset.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <!-- Homepage -->
            <url>
                <loc>https://arabati.onrender.com/</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
            </url>

            <!-- Our Games -->
            <url>
                <loc>https://arabati.onrender.com/#our-games</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>

            <!-- About Us -->
            <url>
                <loc>https://arabati.onrender.com/#about-us</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>yearly</changefreq>
                <priority>0.6</priority>
            </url>

            <!-- Contact Us -->
            <url>
                <loc>https://arabati.onrender.com/#contact-us</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>yearly</changefreq>
                <priority>0.6</priority>
            </url>

            <!-- Privacy Policy -->
            <url>
                <loc>https://arabati.onrender.com/privacy-policy</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>yearly</changefreq>
                <priority>0.5</priority>
            </url>

            <!-- Desert Defense Privacy Policy -->
            <url>
                <loc>https://arabati.onrender.com/games/desertdefense/privacy-policy</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>yearly</changefreq>
                <priority>0.5</priority>
            </url>

            <!-- Red Hood Privacy Policy -->
            <url>
                <loc>https://arabati.onrender.com/games/redhood/privacy-policy</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>yearly</changefreq>
                <priority>0.5</priority>
            </url>
        </urlset>`;
    res.send(sitemap.trim());
});

module.exports = router;
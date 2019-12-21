let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { page: 'home' });
});

router.get('/gallery', (req, res) => {
    res.render('gallery', { page: 'gallery' });
})

router.get('/contact', (req, res) => {
    res.render('contact', { page: 'contact' });
})

router.get('/order', (req, res) => {
    res.render('order');
});


module.exports = router;
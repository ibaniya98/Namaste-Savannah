let express = require('express');
let router = express.Router();

let Partner = require('../models/partner');


router.get('/', (req, res) => {
    Partner.find({showInHomepage: true}, (err, partners) => {
        res.render('index', { page: 'home', partners: partners});
    });
});

router.get('/gallery', (req, res) => {
    res.render('gallery', { page: 'gallery' });
})

router.get('/contact', (req, res) => {
    res.render('contact', { page: 'contact' });
});


module.exports = router;
let express = require('express'),
    Menu = require('../models/menuItem');

let router = express.Router();

router.get('/menu', (req, res) => {
    res.render('menu', {page: 'menu'});
});

router.post('/menu/items/:id', (req, res) => {
    


});


// ------------ API Endpoints -------------

router.get('/menu/category', (req, res) => {
    Menu.find().distinct('category', (err, categories) => {
        if (err){
            res.status(500).send(err.message);
        } else {
            res.send(categories);
        }
    });
});

router.get('/menu/category/:categoryName', (req, res) => {
    Menu.find({category: req.params.category}, (err, items) => {
        if (err){
            res.status(500).send(err.message);
        }
        else if (!items){
            res.status(404).send('No items found for the given category');
        }
        else {
            res.send(items);
        }
    });
});

router.get('/menu/items', (req, res) => {
    Menu.find({}, (err, items) => {
        if (err){
            res.status(500).send(err.message);
        } else {
            res.send(items);
        }
    });
});

router.get('/menu/items/:id', (req, res) => {
    Menu.findById(req.params.id, (err, item) => {
        if (err){
            res.status(500).send(err.message);
        } else if (!item) {
            res.status(404).send('No item found for the given id');
        } else {
            res.send(item);
        }
    });
});

module.exports = router;


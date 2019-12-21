let express = require('express'),
    Menu = require('../models/menuItem'),
    middleWare = require('../middleware');

let router = express.Router();

router.get('/menu', (req, res) => {
    Menu.find().distinct('category', (err, categories) => {
        if (err) {
            //TODO: Create a common error page and display error message
            res.render('menu/menu', { page: 'menu', error: 'Unable to retrieve menu categories' });
        } else {
            Menu.find({}, (err, items) => {
                if (err) {
                    res.render('menu/menu', { page: 'menu', error: 'Unable to retrieve menu items' });
                } else {
                    res.render('menu/menu', { page: 'menu', menuItems: items, categories: categories });
                }
            });
        }
    });
});

// Add new Menu Item
router.post('/menu', middleWare.isLoggedIn, (req, res) => {    
    var menuItem = parseMenuForm(req);
    Menu.create(menuItem, (err, item) => {
        if (err) {
            req.flash('error','Failed to create menu item');
            res.redirect('back');
        } else {
            req.flash('success','Successfully created a menu item');
            res.redirect('/menu');
        }
    });
});

// Render page to create new Menu Item
router.get('/menu/new', middleWare.isLoggedIn, (req, res) => {
    Menu.find().distinct('category', (err, categories) => {
        if (err) {
            backup = ['Starters', 'Soup', 'Salad', 'Biryani', 'Momo', 'Tandoor',
                'Bowl', 'Kids Corner', 'Nepalese Fusion', 'Sides', 'Bread', 'Desserts', 'Beverages'];
            res.render('menu/newMenu', { categories: backup });
        } else {
            res.render('menu/newMenu', { categories: categories });
        }
    });
});

// Edit existing menu item
router.get('/menu/:id/edit', middleWare.isLoggedIn, (req, res) => {
    Menu.findById(req.params.id, (err, item) => {
        if (err || !item) {
            req.flash('error', 'Failed to find the item. Please try again later or contact the admin');
            res.redirect('back');
        } else {
            Menu.find().distinct('category', (err, categories) => {
                if (err || !categories){
                    req.flash('error', 'Failed to find categories. Please try again later or contact the admin');
                    res.redirect('back');
                } else{
                    res.render('menu/editMenu', {item: item, categories: categories});
                }
            });
        }
    });
});

// Update Existing Menu Item
router.put('/menu/:id', middleWare.isLoggedIn, (req, res) => {
    var newMenu = parseMenuForm(req);

    Menu.findByIdAndUpdate(req.params.id, newMenu, (err, item) => {
        if (err){
            req.flash('error', 'Failed to update the menu item. Please try again later.');
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully updated the menu item: ' + item.itemName);
            res.redirect('/menu');
        }
    });
});

router.delete('/menu/:id', middleWare.isAuthorized, (req, res) => {
    Menu.findByIdAndDelete(req.params.id, (err) => {
        if (err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success','Successfully deleted the menu item');
            res.redirect('/menu');
        }
    })
});


// --------- Helper Function -------------

function parseMenuForm(req){
    var menuItem = req.body.menu;

    if (menuItem['category'].toLowerCase() == "new") {
        menuItem.category = req.body.newCategory;
    }

    // Add pricing options    
    var pricing = req.body.pricing;
    menuItem.options = [];

    if (pricing['price'] instanceof Array) {
        for (var i = 0; i < pricing['title'].length; i++) {
            menuItem.options.push({
                price: Number.parseFloat(pricing['price'][i]),
                title: pricing['title'][i]
            });
        }
    } else {
        menuItem.options = [{
            price: Number.parseFloat(pricing['price']),
            title: pricing['title']
        }];
    }

    return menuItem;
}


// ------------ API Endpoints -------------

router.get('/menu/category', (req, res) => {
    Menu.find().distinct('category', (err, categories) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(categories);
        }
    });
});

router.get('/menu/category/:categoryName', (req, res) => {
    Menu.find({ category: req.params.category }, (err, items) => {
        if (err) {
            res.status(500).send(err.message);
        }
        else if (!items) {
            res.status(404).send('No items found for the given category');
        }
        else {
            res.send(items);
        }
    });
});

router.get('/menu/items', (req, res) => {
    Menu.find({}, (err, items) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(items);
        }
    });
});

router.get('/menu/items/:id', (req, res) => {
    Menu.findById(req.params.id, (err, item) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (!item) {
            res.status(404).send('No item found for the given id');
        } else {
            res.send(item);
        }
    });
});

module.exports = router;

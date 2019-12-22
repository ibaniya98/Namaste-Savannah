let express = require('express'),
    Menu = require('../models/menuItem'),
    Buffet = require('../models/buffet'),
    middleWare = require('../middleware'),
    async = require('async');

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
            req.flash('error', 'Failed to create menu item');
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully created a menu item');
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
                if (err || !categories) {
                    req.flash('error', 'Failed to find categories. Please try again later or contact the admin');
                    res.redirect('back');
                } else {
                    res.render('menu/editMenu', { item: item, categories: categories });
                }
            });
        }
    });
});

// Update Existing Menu Item
router.put('/menu/:id', middleWare.isLoggedIn, (req, res) => {
    var newMenu = parseMenuForm(req);

    Menu.findByIdAndUpdate(req.params.id, newMenu, (err, item) => {
        if (err) {
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
        if (err) {
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully deleted the menu item');
            res.redirect('/menu');
        }
    })
});

router.get('/buffet', (req, res) => {
    Buffet.findOne({}).sort('-updatedAt').populate('items').exec((err, item) => {
        if (err) {
            //TODO - Redirect to error page
            res.redirect('/')
        } else {
            var buffet = undefined, unsetBuffet = undefined;
            if (!item) {
                unsetBuffet = true;
            } else {
                buffet = item;
            }
            res.render('menu/buffet', {
                page: 'menu',
                unsetBuffet: unsetBuffet,
                buffet: buffet
            });
        }
    });
});

router.post('/buffet', middleWare.isAuthorized, (req, res) => {
    // There is an existing buffet. Update that buffet
    if (req.body.id && req.body.id.length > 0) {
        req.body.buffet.updatedAt = Date.now();
        req.body.buffet.items = req.body.items;

        Buffet.findByIdAndUpdate(req.body.id, req.body.buffet, (err, buffet) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Failed to create buffet');
                res.redirect('back');
            } else {
                console.log('Redirecting the page');
                req.flash('success', 'Successfully updated the buffet');
                res.redirect('/buffet');
            }
        });
    } else {
        console.log('Creating a new buffet');
        req.body.buffet.items = req.body.items;
        Buffet.create(req.body.buffet, (err, buffet) => {
            if (err) {
                req.flash('error', 'Failed to create buffet');
                res.redirect('back');
            } else {
                req.flash('success', 'Successfully created the buffet');
                res.redirect('/buffet');
            }
        })
    }
});

router.get('/buffet/edit', middleWare.isAuthorized, (req, res) => {
    Buffet.findOne({}).sort('-updatedAt').populate('items').exec((err, item) => {
        if (err || !item) {
            req.flash('error', 'Failed to find the recent buffet menu');
            item = {
                _id: "",
                price: "",
                startTime: "",
                endTime: "",
                items: []
            }
        }
        res.render('menu/editBuffet', {
            page: 'menu',
            buffet: item
        });
    });
});


// --------- Helper Functions -------------

function parseMenuForm(req) {
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

module.exports = router;

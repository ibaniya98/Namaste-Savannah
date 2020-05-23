let express = require('express'),
    middleWare = require('../middleware'),
    MenuHelpers = require('../util/menuHelpers'),
    BuffetHelpers = require('../util/buffetHelpers');

let router = express.Router();

router.get('/menu', async (req, res) => {
    try {
        const categories = await MenuHelpers.getDistinctCategories();
        const menuItems = await MenuHelpers.getMenuItems();
        MenuHelpers.shuffleMenu(menuItems);

        res.render('menu/menu', { page: 'menu', menuItems: menuItems, categories: categories });

    } catch (err) {
        console.log(err);
        res.redirect('/error');
    }
});

// Render page to create new Menu Item
router.get('/menu/new', middleWare.isLoggedIn, async (req, res) => {
    MenuHelpers.getDistinctCategories().then(categories => {
        res.render('menu/newMenu', { categories: categories });
    }).catch(err => {
        res.redirect('/error');
    });
});

// Add new Menu Item
router.post('/menu', middleWare.isLoggedIn, (req, res) => {
    const menuItem = MenuHelpers.parseMenuForm(req);
    MenuHelpers.addNewMenuItem(menuItem).then(newItem => {
        req.flash('success', 'Successfully created a menu item ' + newItem.itemName);
        res.redirect('/menu');
    }).catch(err => {
        req.flash('error', 'Failed to create menu item');
        res.redirect('back');
    });
});

// Render page to edit a menu item
router.get('/menu/:id/edit', middleWare.isLoggedIn, async (req, res) => {
    try {
        const menuItem = await MenuHelpers.getMenuItemById(req.params.id);
        const categories = await MenuHelpers.getDistinctCategories();

        res.render('menu/editMenu', { item: menuItem, categories: categories });

    } catch (err) {
        req.flash('error', err);
        res.redirect('back');
    }
});

// Update Existing Menu Item
router.put('/menu/:id', middleWare.isLoggedIn, async (req, res) => {
    var newMenu = MenuHelpers.parseMenuForm(req);
    MenuHelpers.updateMenuItem(req.params.id, newMenu).then(resultItem => {
        req.flash('success', 'Successfully updated the menu item: ' + resultItem.itemName);
        res.redirect('/menu');
    }).catch(err => {
        req.flash('error', err);
        res.redirect('back');
    });
});

// Delete menu item based on the id
router.delete('/menu/:id', middleWare.isAuthorized, async (req, res) => {
    MenuHelpers.deleteMenuItem(req.params.id).then(result => {
        req.flash('success', `Successfully deleted the menu item`);
        res.redirect('/menu');
    }).catch(err => {
        req.flash('error', err);
        res.redirect('back');
    });
});

// Render the buffet main page
router.get('/buffet', async (req, res) => {
    BuffetHelpers.getLatestBuffet().then(data => {
        res.render('menu/buffet', {
            page: 'menu',
            unsetBuffet: data.unsetBuffet,
            buffet: data.currentBuffet
        });
    }).catch(err => {
        res.redirect('/error');
    });
});

// Send request to create/update buffet menu
router.post('/buffet', middleWare.isAuthorized, (req, res) => {
    const newBuffet = req.body.buffet;
    newBuffet.menuItems = req.body.items;
    newBuffet.extraItems = req.body.extras;

    // If there is an existing buffet, update that buffet    
    if (req.body.id && req.body.id.length > 0) {
        newBuffet.updatedAt = Date.now();        
        BuffetHelpers.updateBuffet(req.body.id, newBuffet).then(buffet => {
            req.flash('success', 'Successfully updated the buffet');
            res.redirect('/buffet');
        }).catch(err => {
            req.flash('error', err);
            res.redirect('back');
        });
    } else {        
        BuffetHelpers.createBuffet(newBuffet).then(buffet => {
            req.flash('success', 'Successfully created the buffet');
            res.redirect('/buffet');
        }).catch(err => {
            req.flash('error', err);
            res.redirect('back');
        });
    }
});

// Render page to update buffet menu
router.get('/buffet/edit', middleWare.isAuthorized, async (req, res) => {
    let buffet;
    try {
        const {currentBuffet} = await BuffetHelpers.getLatestBuffet();
        buffet = currentBuffet;
    } catch (err) {
        req.flash('error', 'Failed to find the most recent buffet menu');
        buffet = BuffetHelpers.getEmptyBuffetItem();
    }

    res.render('menu/editBuffet', {
        page: 'menu',
        buffet: buffet
    });
});

module.exports = router;

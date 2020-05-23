const Menu = require('../models/menuItem');

/**
 * This method shuffles the array that is passed.
 * 
 * @param {Array} items Array of items to be sorted
 * @public
 */
function shuffleMenu(items) {
    for (var i = items.length - 1; i > 0; i--) {
        var index = Math.floor(Math.random() * (i + 1));
        var temp = items[i];
        items[i] = items[index];
        items[index] = temp;
    }
}

/**
 * This method parses the request body sent to the express.
 * It returns a Menu object that matches Menu Model in the database
 * 
 * @param {Request} req Request sent to the express
 * @returns {obj} Menu entity based on the request
 * @public
 */
function parseMenuForm(req) {
    const menuItem = req.body.menu;

    // Check if the category specified is new. If true, get the new category name
    if (menuItem['category'].toLowerCase() == "new") {
        menuItem.category = req.body.newCategory;
    }

    // Add pricing options    
    var pricing = req.body.pricing;
    menuItem.options = [];

    // Multiple options has been added
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

//------------ Database Operations -------------------

/**
 * This method retrieves all distinct categories in our database
 * used by the menu items
 * The caller must handle any exception
 * 
 * @returns {Promise<Array<string>>} distinct categories in the database
 * @public
 */
async function getDistinctCategories() {
    return Menu.find().distinct('category').exec()
        .catch(error => {
            console.log(error);
            throw 'Failed to find distinct categories'
        });
}

/**
 * This method retrieves all available menu items from the database
 * 
 * @returns {Promise<Array<obj>>} array of Menu documents
 * @public
 */
async function getMenuItems() {
    return Menu.find().exec().catch(error => {
        console.log(error);
        throw 'Failed to find menu items';
    });
}

/**
 * This method adds a new menu object to the database
 * It validates the object to be inserted and throws exception if not valid.
 * The caller must handle all exceptions.
 * 
 * @param {obj} menuItem menu to be added
 * @returns {Promise<obj>} newly created Menu document
 * @public
 */
async function addNewMenuItem(menuItem) {

    // Ensure the prices are valid
    if (!hasValidPrices(menuItem.options)) {
        throw 'All prices must be atleast $ 0.01';
    }

    const newMenuItem = new Menu(menuItem);
    return newMenuItem.save().then(item => {
        console.log(`Added new item '${item.itemName}' [${item._id}]`);
        return item;
    }).catch(error => {
        console.log(error);
        throw 'Failed to add the menu item';
    });
}

/**
 * This method retrives the document based on the provided id
 * 
 * @param {string | mongoose.ObjectId} menuId 
 * @returns {Promise<obj>} Menu document based on the id
 * @public
 */
async function getMenuItemById(menuId) {
    return Menu.findById(menuId).exec()
        .then(item => {
            if (!item) {
                throw `No item found for ${menuId}`;
            }
            return item;
        })
        .catch(error => {
            console.log(error);
            throw `Failed to retrieve item for item id: ${menuId}`
        });
}

/**
 * This method updates the document based on the provided id and new data.
 * It validates the new data and throws exception if it is no valid.
 * The caller must handle all exceptions.
 * 
 * @param {string | Mongoose.ObjectId} menuId Id of the document to be updated
 * @param {obj} newMenuItem new contents for the document
 * @returns {Promise<obj>} updated document
 * @public
 */
async function updateMenuItem(menuId, newMenuItem) {
    if (!hasValidPrices(newMenuItem.options)) {
        throw 'All prices must be atleast $ 0.01';
    }

    return Menu.findByIdAndUpdate(menuId, newMenuItem, { new: true }, (err, item) => {
        if (err) {
            console.log(err);
            throw 'Error updating menu item';
        } else if (!item) {
            throw 'No item found after updating the menu item';
        } else {
            return item;
        }
    });
}

/**
 * This method deletes the Menu document based on the provided id
 * 
 * @param {string | Mongoose.ObjectId} menuId
 * @public
 */
async function deleteMenuItem(menuId) {
    return Menu.findByIdAndDelete(menuId, (err, item) => {
        if (err) {
            console.log(err);
            throw `Failed to delete menu item`;
        }
        console.log('Successfully deleted the item');
    });
}

/**
 * This method validates all the prices are populated correctly.
 * It must be atleast $0.01
 * 
 * @param {Array<obj>} options different options for the menu item
 * @returns {boolean} true if the prices are valid
 */
function hasValidPrices(options) {
    return options.every(option => option.price >= 0.01);
}

module.exports = {
    shuffleMenu,
    parseMenuForm,
    getDistinctCategories,
    getMenuItems,
    addNewMenuItem,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
}



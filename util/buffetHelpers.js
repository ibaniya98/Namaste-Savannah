const Buffet = require('../models/buffet');


/**
 * This method searches for the most recent buffet menu.
 * If no buffet menu is found, unset buffet is set to true and returns empty buffet items.
 * If buffet menu is found, it ensures the menu items and extra items are array and initialized as needed.
 * It returns unset value and buffet menu as object as a promise.
 * The caller must handle any exception.
 * 
 * @returns {Promise | obj} returns an object with values for 
 *  unsetBuffet as boolean and current buffet items
 * @public
 */
async function getLatestBuffet() {
    try {
        let currentBuffet = await Buffet.findOne({}).sort('-updatedAt');
        let unsetBuffet = false;

        // Check if the buffet exists
        if (!currentBuffet) {
            unsetBuffet = true;
            currentBuffet = {
                menuItems: [],
                extraItems: []
            };
        } else {
            // If the buffet exists, populate the menu for the buffet
            await currentBuffet.populate('menuItems').execPopulate();

            // If no menu exists for the buffet, intialize it to empty array.
            if (!currentBuffet.menuItems || !currentBuffet.menuItems instanceof Array) {
                currentBuffet.menuItems = [];
            }

            // If no extra items for the buffet exists, initialize it to empty array
            if (!currentBuffet.extraItems || !currentBuffet.extraItems instanceof Array) {
                currentBuffet.extraItems = [];
            }

            // If no menu item or extra item exists, then buffet can be considered as unset
            if (currentBuffet.extraItems.length == 0 && currentBuffet.menuItems.length == 0) {
                unsetBuffet = true;
            }
        }

        return { unsetBuffet, currentBuffet };
    } catch (err) {
        console.log(err);
        throw 'Failed to get the latest buffet';
    }
}

/**
 * This method takes a buffet object to be added to the database.
 * Check models/Buffet.js for the schema of Buffet
 * The caller must handle the exceptions thrown.
 * 
 * @param {obj} buffet new buffet menu to be added to the database
 * @returns {obj} newly created buffet menu document
 * @public
 */
async function createBuffet(buffet) {
    Buffet.create(buffet, (err, buffet) => {
        if (err) {
            console.log(err);
            throw 'Failed to create a new buffet';
        } else {
            return buffet;
        }
    });
}

/**
 * This method updates the buffet based on the buffet id and new buffet menu
 * passed to it.
 * The caller must handle the exceptions thrown.
 * 
 * @param {mongoose.ObjectId | string} buffetId id of the buffet
 * @param {obj} newBuffet updated buffet menu
 * @returns {obj} updated buffet document
 * @public
 */
async function updateBuffet(buffetId, newBuffet) {
    Buffet.findByIdAndUpdate(buffetId, newBuffet, (err, buffet) => {
        if (err) {
            console.log(err);
            throw 'Failed to update the buffet';
        } else {
            return buffet;            
        }
    });
}

/**
 * This method creates an empty buffet menu that matches the schema.
 * 
 * @returns {obj} Empty buffet menu
 * @public
 */
function getEmptyBuffetItem() {
    return {
        _id: "",
        price: "",
        startTime: "",
        endTime: "",
        menuItems: [],
        extraItems: []
    }
}

/**
 * This module contains methods required to access database to perform operations for Buffet
 */
module.exports = {
    getLatestBuffet,
    createBuffet,
    updateBuffet,
    getEmptyBuffetItem
};
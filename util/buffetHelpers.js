const Buffet = require("../db/models/buffet");

const { getBuffet } = require("../db/actions/buffet");

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
    const currentBuffet = await getBuffet();

    // If no menu item or extra item exists, then buffet can be considered as unset
    let unsetBuffet =
      currentBuffet.extraItems.length == 0 &&
      currentBuffet.menuItems.length == 0;

    return { unsetBuffet, currentBuffet };
  } catch (err) {
    console.log(err);
    throw "Failed to get the latest buffet";
  }
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
    extraItems: [],
  };
}

module.exports = {
  getLatestBuffet,
  getEmptyBuffetItem,
};

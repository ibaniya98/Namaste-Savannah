const Menu = require("../models/menuItem");

/**
 * This method retrieves all distinct categories in our database
 * used by the menu items
 * The caller must handle any exception
 *
 * @returns {Promise<Array<string>>} distinct categories in the database
 * @public
 */
async function getDistinctCategories() {
  return Menu.find({})
    .distinct("category")
    .exec()
    .catch((error) => {
      console.error(error);
      throw "Failed to find distinct categories";
    });
}

/**
 * This method retrieves all available menu items from the database
 *
 * @returns {Promise<Array<obj>>} array of Menu documents
 * @public
 */
async function getMenuItems() {
  return Menu.find({})
    .exec()
    .catch((error) => {
      console.error(error);
      throw "Failed to find menu items";
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
  return Menu.findById(menuId)
    .exec()
    .then((item) => {
      if (!item) {
        throw `No item found for ${menuId}`;
      }
      return item;
    })
    .catch((error) => {
      console.error(error);
      throw `Failed to retrieve item for item id: ${menuId}`;
    });
}

async function saveNewMenuItem(menuItem) {
  const newMenuItem = new Menu(menuItem);
  return newMenuItem
    .save()
    .then((item) => {
      console.info(`Added new item '${item.itemName}' [${item._id}]`);
      return item;
    })
    .catch((error) => {
      console.error(error);
      throw "Failed to add the menu item";
    });
}

async function updateExistingMenuItem(menuId, newMenuItem) {
  return Menu.findByIdAndUpdate(
    menuId,
    newMenuItem,
    { new: true },
    (err, item) => {
      if (err) {
        console.log(err);
        throw "Error updating menu item";
      } else if (!item) {
        throw "No item found after updating the menu item";
      } else {
        return item;
      }
    }
  );
}

/**
 * This method deletes the Menu document based on the provided id
 *
 * @param {string | Mongoose.ObjectId} menuId
 * @returns {Promise<obj>} Menu document that was deleted
 * @public
 */
async function removeMenuItemById(menuId) {
  return Menu.findByIdAndDelete(menuId, (err, item) => {
    if (err) {
      console.error(err);
      throw `Failed to delete menu item`;
    }
    return item;
  });
}

module.exports = {
  getDistinctCategories,
  getMenuItems,
  getMenuItemById,
  saveNewMenuItem,
  updateExistingMenuItem,
  removeMenuItemById,
};

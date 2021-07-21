const Menu = require("../models/menuItem");
const {
  getCacheValue,
  setCacheValue,
  deleteCacheKey,
} = require("../../util/cache");

const MENU_ITEMS_CACHE_KEY = "__menu_items__";
const CATEGORIES_CACHE_KEY = "__categories__";

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
 * This method retrieves all distinct categories in our database
 * used by the menu items
 * The caller must handle any exception
 *
 * @returns {Promise<Array<string>>} distinct categories in the database
 * @public
 */
async function getDistinctCategories() {
  const cachedCategories = getCacheValue(CATEGORIES_CACHE_KEY);
  if (cachedCategories) {
    return cachedCategories;
  }

  return Menu.find({})
    .distinct("category")
    .exec()
    .then((categories) => {
      setCacheValue(CATEGORIES_CACHE_KEY, categories);
      return categories;
    })
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
  const cachedMenuItems = getCacheValue(MENU_ITEMS_CACHE_KEY);
  if (cachedMenuItems) {
    return cachedMenuItems;
  }

  return Menu.find({})
    .exec()
    .then((menuItems) => {
      shuffleMenu(menuItems);
      setCacheValue(MENU_ITEMS_CACHE_KEY, menuItems);
      return menuItems;
    })
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
      deleteCacheKey(MENU_ITEMS_CACHE_KEY);
      deleteCacheKey(CATEGORIES_CACHE_KEY);
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
        deleteCacheKey(MENU_ITEMS_CACHE_KEY);
        deleteCacheKey(CATEGORIES_CACHE_KEY);
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
    deleteCacheKey(MENU_ITEMS_CACHE_KEY);
    deleteCacheKey(CATEGORIES_CACHE_KEY);
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

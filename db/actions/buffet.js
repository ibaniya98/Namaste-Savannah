const Buffet = require("../models/buffet");

async function getBuffet() {
  const currentBuffet = await Buffet.findOne({}).sort("-updatedAt");

  // Check if a buffet exists
  if (currentBuffet) {
    // If the buffet exists, populate the menu for the buffet
    await currentBuffet.populate("menuItems").execPopulate();

    // If no menu exists for the buffet, intialize it to empty array.
    if (!currentBuffet.menuItems || !currentBuffet.menuItems instanceof Array) {
      currentBuffet.menuItems = [];
    }

    // If no extra items for the buffet exists, initialize it to empty array
    if (
      !currentBuffet.extraItems ||
      !currentBuffet.extraItems instanceof Array
    ) {
      currentBuffet.extraItems = [];
    }
  } else {
    currentBuffet.menuItems = [];
    currentBuffet.extraItems = [];
  }

  return currentBuffet;
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
      console.error(err);
      throw "Failed to create a new buffet";
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
      console.error(err);
      throw "Failed to update the buffet";
    } else {
      return buffet;
    }
  });
}

module.exports = {
  getBuffet,
  createBuffet,
  updateBuffet,
};

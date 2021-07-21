let express = require("express"),
  middleware = require("../middleware");
let router = express.Router();

let Partner = require("../db/models/partner");
const {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
} = require("../db/actions/partner");

router.get("/order", async (req, res) => {
  try {
    const partners = await getPartners();
    if (!partners) {
      throw "No partners found";
    }
    return res.render("order", { partners: partners });
  } catch (err) {
    return res.redirect("/error");
  }
});

router.post("/partner/new", middleware.isAuthorized, async (req, res) => {
  try {
    const partner = parsePartner(req);
    await createPartner(partner);
    req.flash("success", "Successfully added a new partner");
    res.redirect("/order");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add new partner");
    res.redirect("back");
  }
});

router.put("/partner/:id", middleware.isAuthorized, async (req, res) => {
  try {
    const partner = parsePartner(req);
    const updatedPartner = await updatePartner(req.params.id, partner);

    if (!updatedPartner) {
      throw "Partner was not updated";
    }

    req.flash("success", "Successfully updated the partner");
    res.redirect("/order");
  } catch (err) {
    req.flash("error", "Failed to update the partner");
    res.redirect("back");
  }
});

router.delete("/partner/:id", middleware.isAuthorized, async (req, res) => {
  try {
    await deletePartner(req.params.id);
    req.flash("success", "Successfully deleted the partner");
    res.redirect("/order");
  } catch (err) {
    req.flash("error", "Failed to delete the partner");
    res.redirect("back");
  }
});

// Parses the request to match it with Partner Schema
function parsePartner(req) {
  var partner = req.body.partner;
  var items = [];
  partner.popularItems.split(",").forEach((item) => {
    items.push(item.trim());
  });
  partner.popularItems = items;
  partner.isPopular = partner.isPopular && partner.isPopular == "on";
  partner.showInHomepage =
    partner.showInHomepage && partner.showInHomepage == "on";

  return partner;
}

module.exports = router;

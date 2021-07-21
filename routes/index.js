let express = require("express");
let router = express.Router();

const { getPartners } = require("../db/actions/partner");

router.get("/", async (req, res) => {
  let homepagePartners = [];
  try {
    const partners = await getPartners();
    if (partners) {
      homepagePartners = partners.filter((x) => x.showInHomepage);
    }
  } catch (err) {
    console.error("Failed to find partners for homepage");
    homepagePartners = [];
  }

  return res.render("index", { page: "home", partners: homepagePartners });
});

router.get("/gallery", (req, res) => {
  res.render("gallery", { page: "gallery" });
});

module.exports = router;

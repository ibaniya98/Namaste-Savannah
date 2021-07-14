const express = require("express");
const router = express.Router();

const Partner = require("../models/partner");

const { getCacheValue, setCacheValue } = require("../util/cache");

const PARTNERS_CACHE_KEY = "__homepage_partners__";

router.get("/", (req, res) => {
  const partners = getCacheValue(PARTNERS_CACHE_KEY);
  if (partners) {
    return res.render("index", { page: "home", partners: partners });
  }

  Partner.find({ showInHomepage: true }, (err, partners) => {
    if (err) {
      partners = [];
    } else {
      setCacheValue(PARTNERS_CACHE_KEY, partners);
    }

    res.render("index", { page: "home", partners: partners });
  });
});

router.get("/gallery", (req, res) => {
  res.render("gallery", { page: "gallery" });
});

module.exports = router;

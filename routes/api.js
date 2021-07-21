let express = require("express"),
  cors = require("cors"),
  Menu = require("../db/models/menuItem"),
  Buffet = require("../db/models/buffet");

let router = express.Router();
router.use(cors());

router.get("/menu/category", (req, res) => {
  Menu.find().distinct("category", (err, categories) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(categories);
    }
  });
});

router.get("/menu/category/:categoryName", (req, res) => {
  Menu.find({ category: req.params.categoryName }, (err, items) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!items) {
      res.status(404).send("No items found for the given category");
    } else {
      res.send(items);
    }
  });
});

router.get("/menu/items", (req, res) => {
  Menu.find({}, (err, items) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      var filteredItems = [];
      items.forEach((item) => {
        filteredItems.push({
          id: item.id,
          itemName: item.itemName,
        });
      });
      res.send(filteredItems);
    }
  });
});

router.get("/menu/items/all", (req, res) => {
  Menu.find({}, (err, items) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(items);
    }
  });
});

router.get("/menu/items/:id", (req, res) => {
  Menu.findById(req.params.id, (err, item) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!item) {
      res.status(404).send("No item found for the given id");
    } else {
      res.send(item);
    }
  });
});

router.get("/buffet/all", (req, res) => {
  Buffet.find({}, (err, items) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (!items || items.length == 0) {
      res.status(500).send("No buffet found");
    } else if (items) {
      res.send(items);
    }
  });
});

router.get("/buffet/latest", (req, res) => {
  Buffet.findOne({})
    .sort("-updatedAt")
    .populate("menuItems")
    .exec((err, item) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send(item);
      }
    });
});

router.get("/buffet/:id", (req, res) => {
  Buffet.findById(req.params.id)
    .populate("items")
    .exec((err, buffet) => {
      res.send(buffet);
    });
});

module.exports = router;

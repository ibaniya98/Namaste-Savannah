const Partner = require("../models/partner");

const {
  getCacheValue,
  setCacheValue,
  deleteCacheKey,
} = require("../../util/cache");

const PARTNERS_CACHE_KEY = "__partners__";

const // Initial Data Seed
  seed = [
    {
      name: "Grubhub",
      imageUrl: "img/partners/grubhub.png",
      popularItems: ["Garlic Naan", "Kothe Mo:Mo", "Tikka Masala"],
      orderLink: "https://www.grubhub.com/delivery/ga-savannah",
      showInHomepage: true,
    },
    {
      name: "Uber Eats",
      imageUrl: "img/partners/uber.svg",
      popularItems: ["Tikka Masala", "Garlic Naan", "Mango Lassi"],
      orderLink:
        "https://www.ubereats.com/en-US/savannah/food-delivery/namaste-savannah/20sFR2IMTlaCH3sdYxTbVw/",
      isPopular: true,
      showInHomepage: true,
    },
    {
      name: "Waitr",
      imageUrl: "img/partners/waitr.png",
      popularItems: ["Tikka Masala", "Kothe Mo:Mo", "Korma"],
      orderLink:
        "https://waitrapp.com/restaurants/ga/pooler/namaste-savannah/14312",
      showInHomepage: true,
    },
  ];

async function getPartners() {
  const cachedPartners = getCacheValue(PARTNERS_CACHE_KEY);
  if (cachedPartners) {
    return cachedPartners;
  }

  return await Partner.find({})
    .exec()
    .then((partners) => {
      setCacheValue(PARTNERS_CACHE_KEY, partners);
      return partners;
    })
    .catch((error) => {
      console.error(error);
      throw "Failed to find menu partners";
    });
}

async function createPartner(partner) {
  const newPartner = new Partner(partner);
  return newPartner
    .save()
    .then((item) => {
      console.info(`Added new partner '${item.name}' [${item.id}]`);
      deleteCacheKey(PARTNERS_CACHE_KEY);
      return item;
    })
    .catch((error) => {
      console.error(error);
      throw "Failed to add new partner";
    });
}

async function updatePartner(partnerId, newPartner) {
  return Partner.findByIdAndUpdate(
    partnerId,
    newPartner,
    { new: true },
    (err, partner) => {
      if (err) {
        console.error(err);
        throw "Failed to update the partner";
      } else {
        deleteCacheKey(PARTNERS_CACHE_KEY);
        return partner;
      }
    }
  );
}

async function deletePartner(partnerId) {
  return new Promise((resolve, reject) => {
    Partner.findByIdAndDelete(req.params.id, (err) => {
      if (err) {
        reject(err);
      } else {
        deleteCacheKey(PARTNERS_CACHE_KEY);
        resolve();
      }
    });
  });
}

module.exports = {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
};

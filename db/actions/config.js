const Config = require("../models/config");

const EMAIL_TOKEN = "emailToken";

async function getToken() {
  return new Promise((resolve, reject) => {
    Config.findOne({ key: EMAIL_TOKEN }, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      return resolve(token);
    });
  });
}

async function saveToken(token) {
  const newToken = await Config.findOneAndUpdate(
    { key: EMAIL_TOKEN },
    { value: token },
    {
      new: true,
      upsert: true,
    }
  );
  return newToken;
}

module.exports = {
  getToken,
  saveToken,
};

const { google } = require("googleapis");
const { getClient } = require("./client");

/**
 * Lists the labels in the user's account.
 * This can be used to test the integration with Gmail API
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.labels.list(
    {
      userId: "me",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log("Labels:");
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log("No labels found.");
      }
    }
  );
}

async function sendEmail(auth, content) {
  const gmail = google.gmail({ version: "v1", auth });

  const emailPayload = [
    'Content-Type: text/html; charset="UTF-8"\n',
    "MINE-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    `to: ${process.env.RECIPIENT_EMAIL} \n`,
    `from: ibaniya.automation@gmail.com \n`,
    `subject: Message from Namaste Savannah Website \n\n`,
    content,
  ].join("");

  const encodedData = Buffer.from(emailPayload)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const response = await gmail.users.messages.send({
    auth: auth,
    userId: "me",
    requestBody: {
      raw: encodedData,
    },
  });

  return response;
}

module.exports = {
  sendEmail,
};

// getClient()
//   .then(async (auth) => {
//     try {
//       await sendEmail(
//         auth,
//         "test@gmail.com",
//         "Test Email",
//         "Awesome that you are seeing this message!"
//       );
//     } catch (err) {
//       console.error("Failed to send email");
//       throw err;
//     }
//   })
//   .catch((err) => {
//     console.error(err);
//   });

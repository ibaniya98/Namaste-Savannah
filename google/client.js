const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { getToken, saveToken } = require("../db/actions/config");

const TOKEN_PATH = "token.json";

// If modifying these scopes, delete stored TOKEN.
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

const credentials = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  project_id: "namaste-savannah",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uris: ["http://localhost"],
};

/** Generate a new token and save it to locally */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error("Error retrieving access token", err);
          reject(err);
          return;
        }

        rawToken = JSON.stringify(token);
        resolve(rawToken);

        // Store the token to db for later program executions
        // Since it runs on serverless, files will be not be available
        // if the instance dies or for new instances that are created
        saveToken(rawToken)
          .then(() => {
            console.log("Token successfully saved in the database");
          })
          .catch((err) => {
            console.err(err);
            return;
          });
      });
    });
  });
}

/** Get OAuth2Client for Google APIs */
async function getClient() {
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  let token = "";
  return new Promise(async (resolve, reject) => {
    try {
      // Check if we have previously stored a token.
      const tokenConfig = await getToken();
      if (tokenConfig) {
        token = tokenConfig["value"];
      } else {
        // No token was previously stored
        token = await getNewToken(oAuth2Client);
      }
    } catch (err) {
      reject(tokenErr);
      return;
    }

    oAuth2Client.setCredentials(JSON.parse(token));
    resolve(oAuth2Client);
  });
}

module.exports = {
  getClient,
};

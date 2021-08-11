const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

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

        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, rawToken, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Token stored to", TOKEN_PATH);
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

  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) {
        try {
          token = await getNewToken(oAuth2Client);
        } catch (tokenErr) {
          reject(tokenErr);
          return;
        }
      }

      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    });
  });
}

module.exports = {
  getClient,
};

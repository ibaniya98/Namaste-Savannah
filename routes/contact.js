const express = require("express");
const fetch = require("node-fetch");
const { getAuthenticatedClient } = require("../google/client");
const { sendEmail } = require("../google/email");

const router = express.Router();

const { getContactMessage } = require("../google/template");

router.get("/contact", (req, res) => {
  res.render("contact", { page: "contact" });
});

router.post("/contact", async (req, res) => {
  try {
    await validateRequest(req);
  } catch (e) {
    res.status(400).send({ message: e });
    return;
  }

  const { name, email, subject, message } = req.body;

  const emailContent = getContactMessage(
    `${name} (${email})`,
    subject,
    message
  );

  try {
    const auth = await getAuthenticatedClient();
    const response = await sendEmail(auth, emailContent);
    
    if (response.status === 200) {
      return res.status(200).json({ status: "success" });
    }
    throw response.statusText;
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

async function validateRequest(req) {
  if (req.body.name === undefined || req.body.name.trim().length == 0) {
    throw "Please provide a name";
  }

  if (req.body.email === undefined || req.body.email.trim().length == 0) {
    throw "Please provide an email";
  } else {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(req.body.email.trim().toLowerCase())) {
      throw "Please provide a valid email";
    }
  }

  if (req.body.subject === undefined || req.body.subject.trim().length == 0) {
    throw "Please provide a subject";
  }

  if (req.body.message === undefined || req.body.message.trim().length == 0) {
    throw "Please provide a message";
  }

  if (req.body["g-recaptcha-response"] === undefined || req.body["g-recaptcha-response"].trim().length === 0) {
    throw "Please complete the reCaptcha challenge";
  }

  const validRecaptcha = await isValidRecaptcha(req.body["g-recaptcha-response"]);
  if (!validRecaptcha) {
    throw "ReCaptcha verification failed. Please try again!";
  }

}

async function isValidRecaptcha(recaptchaResponse) {
  try {
    const recaptchaBody = {
      secret: process.env.GOOGLE_RECAPTCHA_SECRET,
      response: recaptchaResponse,
    };

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(Object.entries(recaptchaBody)).toString(),
    });

    if (response.ok) {
      const apiResponse = await response.json();
      return apiResponse['success'];
    }

    throw "Failed to verify recaptcha on server side"

  } catch (err) {
    console.error(err);
    return false;
  }

}

module.exports = router;

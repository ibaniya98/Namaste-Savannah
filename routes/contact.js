const express = require("express");
const { getAuthenticatedClient } = require("../google/client");
const { sendEmail } = require("../google/email");
const router = express.Router();

const { getContactMessage } = require("../google/template");

router.get("/contact", (req, res) => {
  res.render("contact", { page: "contact" });
});

router.post("/contact", async (req, res) => {
  try {
    validateRequest(req);
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

function validateRequest(req) {
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
}

module.exports = router;

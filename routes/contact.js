let express = require('express'),
    nodemailer = require('nodemailer');
let router = express.Router();

router.get('/contact', (req, res) => {
    res.render('contact', { page: 'contact' });
});

router.post('/contact', (req, res) => {
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    
    var emailContent = ""
    try{
        validateRequest(req);
        emailContent = generateEmailContent(req);
    } catch (e) {
        res.status(400).send(e);
        return;
    }

    let mailOptions = {
        from: req.body.email,
        to: process.env.GMAIL_EMAIL,
        subject: 'Message from namaste-savannah.com [' + req.body.subject + ']',
        text: emailContent
    }

    smtpTransport.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to send email');
        } else {
            res.status(200).send('Successfully sent the email');
        }
    });
});

function generateEmailContent(req){
    var message = "Hello there!\n\nYou have a message from namaste-savannah.com site.\n\tName\n\t\t " + req.body.name;
    message += "\n\n\tEmail\n\t\t " + req.body.email;
    message += "\n\n\tSubject\n\t\t " + req.body.subject;
    message += "\n\n\tMessage\n\t\t" + req.body.message;

    return message;
}

function validateRequest(req){
    if (req.body.name === undefined || req.body.name.trim().length == 0){
        throw 'Please provide a name';
    }

    if (req.body.email === undefined || req.body.email.trim().length == 0){
        throw 'Please provide an email';        
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(req.body.email.trim().toLowerCase())){
            throw 'Please provide a valid email';
        }
    }

    if (req.body.subject === undefined || req.body.subject.trim().length == 0){
        throw 'Please provide a subject';
    }

    if (req.body.message === undefined || req.body.message.trim().length == 0){
        throw 'Please provide a message';
    }
}

module.exports = router;
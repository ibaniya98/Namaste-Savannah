let express = require('express'),
    middleware = require('../middleware');
let router = express.Router();

let Partner = require('../models/partner');

// Initial Data Seed
seed = [
    {
        name: 'Grubhub',
        imageUrl: 'img/partners/grubhub.png',
        popularItems: ['Garlic Naan', 'Kothe Mo:Mo', 'Tikka Masala'],
        orderLink: 'https://www.grubhub.com/delivery/ga-savannah',
        showInHomepage: true
    },
    {
        name: 'Uber Eats',
        imageUrl: 'img/partners/uber.svg',
        popularItems: ['Tikka Masala', 'Garlic Naan', 'Mango Lassi'],
        orderLink: 'https://www.ubereats.com/en-US/savannah/food-delivery/namaste-savannah/20sFR2IMTlaCH3sdYxTbVw/',
        isPopular: true,
        showInHomepage: true
    },
    {
        name: 'Waitr',
        imageUrl: 'img/partners/waitr.png',
        popularItems: ['Tikka Masala', 'Kothe Mo:Mo', 'Korma'],
        orderLink: 'https://waitrapp.com/restaurants/ga/pooler/namaste-savannah/14312',
        showInHomepage: true
    }];

router.get('/order', (req, res) => {
    Partner.find({}, (err, partners) => {
        if (err || !partners){
            res.redirect('back');
        } else {
            res.render('order', {partners: partners});
        }
    });    
});

router.post('/partner/new', middleware.isAuthorized, (req, res) => {
    var partner = parsePartner(req);
    Partner.create(partner, (err, item) => {
        if (err){
            req.flash('error','Failed to add new partner');
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully added a new partner');
            res.redirect('/order');
        }
    });    
});

router.put('/partner/:id', middleware.isAuthorized, (req, res) => {
    var partner = parsePartner(req);

    Partner.findByIdAndUpdate(req.params.id, partner, (err, item) => {
        if (err || !item){
            req.flash('error','Failed to update the partner');
            res.redirect('back');
        } else {
            req.flash('success','Successfully updated the partner');
            res.redirect('/order');
        }
    });
});

router.delete('/partner/:id', middleware.isAuthorized, (req, res) => {
    Partner.findByIdAndDelete(req.params.id, (err) => {
        if (err){
            req.flash('error','Failed to delete the partner');
            res.redirect('back');
        } else {
            req.flash('success','Successfully deleted the partner');
            res.redirect('/order');
        }
    });
});

// Parses the request to match it with Partner Schema
function parsePartner(req){
    var partner = req.body.partner;
    var items = [];
    partner.popularItems.split(",").forEach(item => {
        items.push(item.trim());
    });
    partner.popularItems = items;
    partner.isPopular = partner.isPopular && partner.isPopular == "on";
    partner.showInHomepage = partner.showInHomepage && partner.showInHomepage == "on";

    return partner;
}

module.exports = router;
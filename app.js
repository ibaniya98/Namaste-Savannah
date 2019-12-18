require('dotenv').config();

let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

// <<<<< Express Setup >>>>>>>>>>>
let app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// <<<<<<<<<<< Routes >>>>>>>>>>>>
let menuRoutes = require('./routes/menu');

app.use(menuRoutes);


// <<<<<<<<<<<<<< Database Setup >>>>>>>>>>>>>>>>>
// mongoose.connect(process.env.MONGODB_URL)

app.get('/', (req, res) => {
    res.render('index', {
        page: 'home'
    });
});



app.get('/gallery', (req, res) => {
    res.render('gallery', {page: 'gallery'});
})

app.get('/contact', (req, res) => {
    res.render('contact', {page: 'contact'});
})

app.get('/order', (req, res) => {
    res.render('order');
}); 

app.listen(process.env.PORT || 8080, () => {
    console.log('Starting the server');
});
let mongoose = require('mongoose');

let menuItemSchema = new mongoose.Schema({
    itemName: {type: String, required: true, trim: true},
    itemDescription: {type: String, trim: true},
    attributes: [{type: String, trim: true}],
    options: [{
        price: {type: Number, min: 0.01,},
        option: {type: String, trim: true}
    }],
    category: {type: String, required: true, trim: true},
    image: {
        imageUrl: {type: String, trim: true},
        description: {type:String, trim: true}
    }
    
});

module.exports = mongoose.model('Menu', menuItemSchema);
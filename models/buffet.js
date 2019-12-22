let mongoose = require('mongoose');

let buffetSchema = new mongoose.Schema({
    price: {type: Number, min: 0.01, required: true},
    menuItems: [{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'}],
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    updatedAt: {type: Date, default: Date.now},
    extraItems: [{type:String, trim: true}]
});

module.exports = mongoose.model('Buffet', buffetSchema);
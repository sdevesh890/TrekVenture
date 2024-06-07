const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrekSchema = new Schema({
    title : String , 
    price : String ,
    description : String , 
    location : String
});

module.exports = mongoose.model('Campground',TrekSchema);

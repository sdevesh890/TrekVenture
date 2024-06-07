const mongoose = require("mongoose");
const Campground = require("../models/TrekModel");
const cities = require('./cities');
const {descriptors , places} = require('./seedHelpers');

mongoose.connect("mongodb://127.0.0.1:27017/Trek-Venture");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => 
{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++)
    {
        const random = Math.floor(Math.random()*162);
        const c = new Campground({location : `${cities[random].city},${cities[random].state}`, title : `${sample(descriptors)} ${sample(places)}`});
        await c.save();
    }
};


seedDB();
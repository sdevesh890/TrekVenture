const mongoose = require("mongoose");
const Campground = require("../models/TrekModel");
const cities = require('./cities');
const {descriptors , places} = require('./seedHelpers');
const axios = require('axios');

mongoose.connect("mongodb://127.0.0.1:27017/Trek-Venture");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'nlIqPn7uYOiE1kvC5vPy_UIBRfEjKmgVVHoZU6Nwu4g',
        collections: 1114848,
      },
    })
    return resp.data.urls.small
  } catch (err) {
    console.error('ERROR')
  }
}

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 20; i++) {
    // setup
    const placeSeed = Math.floor(Math.random() * places.length)
    const descriptorsSeed = Math.floor(Math.random() * descriptors.length)
    const citySeed = Math.floor(Math.random() * cities.length)
    const price = Math.floor(Math.random()*15 + 1);
    // seed data into campground
    const camp = new Campground({
      author : '66ab832037a11061582557c1',
      title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
      location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
      price : price,
      geometry : {
        type : "Point",
        coordinates : [cities[citySeed].lng,cities[citySeed].lat]
      },
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
        images : [
          {
              url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
              filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
          },
          {
              url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
              filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
          }
      ]
    })
 
    await camp.save()
  }
}

seedDB();
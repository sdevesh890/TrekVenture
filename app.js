const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/TrekModel");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});
mongoose.connect("mongodb://127.0.0.1:27017/Trek-Venture");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/',(req,res)=>
{
   res.render('home');
})

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const camp = new Campground(req.body.campgrounds);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
});


app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  res.render("campgrounds/show", { camp });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  res.render("campgrounds/edit", { camp });
});


app.put('/campgrounds/:id',async(req,res)=>
{
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id,req.body.campgrounds,{new:true});
  console.log(camp);
  res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>
{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})
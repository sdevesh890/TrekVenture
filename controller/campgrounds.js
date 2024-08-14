const Campground = require("../models/TrekModel");
const ObjectID = require("mongoose").Types.ObjectId;
const {cloudinary} = require('../cloudinary');
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.indexCamp = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  }

module.exports.newForm = (req, res) => {
    res.render("campgrounds/new");
}  

module.exports.newCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campgrounds.location, { limit: 1 });
    
    const camp = new Campground(req.body.campgrounds);
    camp.geometry = geoData.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id; 
    await camp.save();
    req.flash('success','Successfully created a new Campground');
    res.redirect(`/campgrounds/${camp._id}`);
    
  }
 module.exports.showPage = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      req.flash('error','Invalid ID');
      return res.redirect('/campgrounds');
    }
    const camp = await Campground.findById(id).populate(
    {
      path : 'reviews' ,
      populate : {
         path : 'author'
      }
    }).populate("author");
    if(!camp)
      {
         req.flash('error','Can not find that campground');
         return res.redirect('/campgrounds');
      }
    res.render("campgrounds/show", { camp });
  }

module.exports.editGet = async (req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      req.flash('error','Invalid ID');
      return res.redirect('/campgrounds');
    }
    const camp = await Campground.findById(id);
    if(!camp)
      {
         req.flash('error','Can not find that campground');
         return res.redirect('/campgrounds');
      }
    res.render("campgrounds/edit", { camp });
  }
  
 module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const camp =  await Campground.findByIdAndUpdate(id, {...req.body.campgrounds}, {
      new: true,
    });
    const geoData = await maptilerClient.geocoding.forward(req.body.campgrounds.location, { limit: 1 });
    camp.geometry = geoData.features[0].geometry;
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...img);
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages)
        {
           cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull : {images : {filename : {$in : req.body.deleteImages}}}});
    }
    req.flash('success','Successfully update campground');
    res.redirect(`/campgrounds/${id}`);
  }
  
  module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully delete campground');
    res.redirect(`/campgrounds`);
  }
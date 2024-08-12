const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
    url : String , 
    filename : String
})
imageSchema.virtual('thumbnail').get(function()
{
    return this.url.replace('/upload','/upload/w_200/h_200')
})
const TrekSchema = new Schema({
    title : String , 
    price : Number ,
    images : [imageSchema],
    description : String , 
    location : String ,
    author : {
        type : Schema.Types.ObjectId , 
        ref : 'User',
    },
    reviews : [
        {
        type : Schema.Types.ObjectId,
        ref : 'Review'
        }
]
});
// Query Middleware 
TrekSchema.post('findOneAndDelete',async(doc)=>
{
   await Review.deleteMany({
        _id : 
        {
            $in : doc.reviews
        }
   })
});

module.exports = mongoose.model('Campground',TrekSchema);

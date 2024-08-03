const Campground = require('./models/TrekModel');
const { campgroundSchema } = require("./Schemas");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be Signed In');
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo = (req,res,next)=>
{
    if(req.session.returnTo)
    {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id))
        {
            req.flash('error',"You don't have permission to change it!");
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
}
module.exports.validateSchema = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
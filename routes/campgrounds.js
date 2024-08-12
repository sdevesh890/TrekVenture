const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn , isAuthor , validateSchema} = require('../Middleware');
const campgrounds = require('../controller/campgrounds');
const {storage} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});
router.get(
  "/" ,
  catchAsync(campgrounds.indexCamp)
);

router.get("/new" ,isLoggedIn, campgrounds.newForm);

router.post(
  "/",isLoggedIn,
  upload.array('image'),
  validateSchema,
  catchAsync(campgrounds.newCampground)
);
router.get(
  "/:id",
  catchAsync(campgrounds.showPage)
);

router.get(
  "/:id/edit",isLoggedIn, isAuthor ,
  catchAsync(campgrounds.editGet)
);

router.put(
  "/:id", isLoggedIn , isAuthor, upload.array('image'),
  validateSchema,
  catchAsync(campgrounds.updateCamp)
);

router.delete(
  "/:id", isLoggedIn , isAuthor , 
  catchAsync(campgrounds.deleteCamp)
);

module.exports = router;

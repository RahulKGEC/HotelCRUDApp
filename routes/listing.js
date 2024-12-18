const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema, reviewSchema } = require('../schema.js');
// const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer  = require('multer')//form ke data ko parse karne ke liye hum multer ka use karenge 
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage})//multer kya karega : forms ke data se files ko nikalega aur unhe uploads naam ke folder jo automatically create hoga || and uploads naam ke folder me save karayega || real project me clouds ka use karte hai

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm); //upar rakhna jaruri hai nahi to id samajhakar database me search marega 



router.route("/").get(wrapAsync(listingController.index)).post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
// router.route("/").get(wrapAsync(listingController.index)).post(upload.single('listing[image]'),(req , res )=>{res.send(req.file);}); //req.body ke andar sara ka  sara data hota tha form ka ||req.file ke andar file related data save hota hai || uploads folder me sabse pahale upload hoga fir nikalenge file ko
//router.route("/")  same path par sara request like : get post delete ko ek baar me handle kiya || compack kar ke likha 

router.route("/:id").get(wrapAsync(listingController.showListing)).put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing , wrapAsync(listingController.updateListing)).delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//  app.get("/listings",(req, res)=>{
//   Listing.find({}).then((res)=>{
//     console.log(res);
//   });
//  })



// upar wala function ko likhne ka naya tarika
//INDEX ROUTE
// router.get("/", wrapAsync(listingController.index));



//Show Route
// router.get("/:id", wrapAsync(listingController.showListing));




//Create Route
// app.post("/listings", async (req, res, next) => {
//   //sare ke sare variable ko extract kare
//   //let {title , description ,image, price, country, location} = req.body;
//   // key value pair bana do , jaha se aaa raha hai , now another way
//   // let listing = req.body.listing;
//   // console.log(req.body);
// try{
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// }catch(err){
//   next(err);
// }
// });





// CREATE Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route      //1st middleware : kya hamara user logged in hai // 2nd middleware :  kya uske pass permission hai  update karne ki
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));




















// app.get("/testListing", async (req, res) => {
//   // yaha par naaya document create karenge
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   // sample listing create kiya ab database me save karna parega
//   await sampleListing.save();
//   // save hone ke baad
//   console.log("sample was saved");
//   res.send("scccessful testing");
// });



module.exports = router;
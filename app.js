if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}
// console.log(process.env.SECRET)



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
// ejs ko set up karo
const path = require("path");
//ejs-mate ko set up karo
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require('./schema.js')
// const Review = require("./models/review.js");


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");


const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


let PORT = 8080;
//main function ko call karne ke liye
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))// static file ko use karne ke liye
app.get("/", (req, res) => {
  res.send("Hi , I am root");
})




const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Makes it inaccessible to JavaScript in the browser// cross scripting attacks , to save
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
};



app.use(session(sessionOptions));
app.use(flash());



//session wala middleware ke baad hi likhna hai hamesa
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))// passport ke andar ,jo hmane nayi local strategy create ki hai , sare ke sare user LocalStrategy ke through authenticate hona chahiye, aure un user ko authenticate karne ke liye kon sa method use hoga ? uske liye authenticate method ko use karenge
passport.serializeUser(User.serializeUser());// user se related jitna bhi information hai , usko store karwate hai usko serialize karna kahate hai
passport.deserializeUser(User.deserializeUser());//user se related jitna bhi information hai , usko unstore karwate hai usko serialize karna kahate hai




app.use((req, res, next) => {
  res.locals.success = req.flash("success");//agar koi bhi success wala massage aata hai  to wo hamare res.locals.success  yaha par success ek variable hai , ke andar save ho jayega 
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;   //currUser ek variable hai , jo req.user ka information ko store karega
  //console.log(res.locals.success);
  next();
})

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld"); // this is a asynchronous method // ye return karega newUser
// res.send(registeredUser);
// })




// pahale flash , and than routes , compulsory
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);













//upar wale route se response bhejo warna random route, jo exist nahi karta hai uske liye route banao
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
  // res.send("Something went wrong!");
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log("server is listening to port  8080");
});

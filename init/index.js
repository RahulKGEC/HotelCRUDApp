const mongoose= require("mongoose");
const initData = require("./data.js");// data ko bhi require kar lenge
const Listing = require("../models/listing.js")//model ko bhi require kar lenge
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
// initialize database
const initDB = async () =>{
    //database ke andar already koi data para hua hai we are going to clean first
    await Listing.deleteMany({});
    // sara data delete ho gaya hai ab insert karo naya data ko
    initData.data = initData.data.map((obj) => ({...obj, owner:'671b32f359e60e18f22ba657' }));// same array me sara data dal diya
    await Listing.insertMany(initData.data) // initData apne aap me object hai data.js me // aur is object ke andar key data ko access karna hai
     console.log("data was initialized");
};


initDB();

const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema; // baar baar mongoose.Schema na likhana pare isiliye Schema vaiable me store kar liya

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String, //image aa rahi hai par khali hai, par link empty hai , // image hi nahi a rahi
  image: {
   url: String,
   filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
// mongoose middleware// jaise hi hum kisi listing ko delete karenge findbyIdandDelete call hoga kisi bhi listing ke liye as a middleware  hamri listing.js ke andar  post mongoose middleware  bhi call hoga  ye uske corresponding sare ke sare reviews ko delete kar dega
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// upar wale schema ka use karke model banao
const Listing = mongoose.model("Listing", listingSchema);
//Listing ek model hai yaha par
module.exports = Listing; // modules.export galat hai // module.export bhi galat hai

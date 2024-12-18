// isme ek ek karke hum apne call backs ko store karenge
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js")


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {

    //console.log(req.user);// request object ke andar user related information store hoti  hai

    res.render("listings/new.ejs");
}





module.exports.showListing = async (req, res) => {
    // jaise hi id aay id ko extract karna parega
    let { id } = req.params;

    // const listing = await Listing.findById(id).populate("reviews").populate("owner");
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing }); //listing ko likh kar listing ka data parse kar diya gaya
}



module.exports.createListing = async (req, res, next) => {
    console.log("req.body:", req.body); // Form data
    console.log("req.file:", req.file); // File data

    if (!req.file) {
        return res.status(400).send("Image file is missing.");
    }

    const { path: url, filename } = req.file; // Extract file details
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


// module.exports.createListing = async (req, res, next) => {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     // console.log(url+"...."+filename);

//     const newListing = new Listing(req.body.listing);
//     // console.log(req.user);
//     newListing.owner = req.user._id;// currenr user ki id store hoti hai// new listing ka owner ho uske andar current user kihi id store ho
//     newListing.image = {url, filename};
//     await newListing.save();
//     req.flash("success", "New Listing Create !");
//     res.redirect("/listings");
// };



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    //console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl =originalImageUrl.replace("/upload", "/upload/w_250,e_blur:300")

    res.render("listings/edit.ejs", { listing , originalImageUrl }); //variable ko pass karo to edit.ejs
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    //console.log(id)


    if (typeof req.file !== "undefined") {  // agar edit ke samay || photo ko edit agar nahi kiya gaya to 
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }


    //jidhar man udhar redirect karo
    //res.redirect("/listings");
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}








module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
};
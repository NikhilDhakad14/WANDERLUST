const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
   const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);  
    res.render("listings/new.ejs");
};

 module.exports.showListing=async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error"," your listing is not exist ");
       return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.creatListing=async( req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    
    req.flash("success","new listing Created!");
    res.redirect("/listings");

};

module.exports.renderEditForm=async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
     let {id}= req.params;
     let listing=await Listing.findById(id);
     if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission to changed other's listings");
        return res.redirect(`/listings/${id}`);
     }
     await Listing.findByIdAndUpdate(id,req.body.listing);
     if(req.file){
        let url = req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
     }
      req.flash("success", "listing edited successfully!");
     res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
     let {id}= req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "listing deleted successfully!");
     res.redirect("/listings");
};

    module.exports.indexCategory=async (req,res)=>{
    const {category}=req.query;
    let filter={};
    if(category){
        filter={category:category}
    }
    const allListings=await Listing.find(filter);
    res.render("listings/index.ejs",{allListings})
};

module.exports.searchListings = async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ]
  });

  res.render("listings/index.ejs", { allListings: listings });
};
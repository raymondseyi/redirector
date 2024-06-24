const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
require("dotenv").config();
const URI = process.env.MONGO_DB_URI;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
let message = ""
let updatedLink = ""
// Mongodb connection setup
mongoose
  .connect(URI)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log("mongodb could not connect", err);
  });

// create link model
const LinkSchema = mongoose.Schema({
  link: { type: String, required: [true, "Link is compulsory"], trim:true },
  createdDate: { type: String, default: Date.now() },
  name: { type: String, default: "link" },
});
const LinkModel = mongoose.model("link", LinkSchema);

// app routes
app.get("/edit", (req, res) => {
  LinkModel.findOne({name:"link"})
  .then((linkDetails)=>{
    updatedLink = linkDetails.link
  })
  .catch((err)=>{
    console.log(err)
  })
  res.render("editpage",{message:message,link:updatedLink||""});
  message = ""
});
app.post("/edit", (req, res) => {
  let newLink = req.body.link;
  LinkModel.findOneAndUpdate(
    { name: "link" },
    { $set: { link: newLink } },
    { upsert: true, new: true }
  )
    .then((updatedDetails) => {
      console.log("link updated",updatedDetails);
      message = "Updated Successfully"
      res.redirect("/edit")
    })
    .catch((err) => {
      console.log("link not uploaded",err);
    });
});
app.get("/redirector", (req, res) => {
    LinkModel.findOne({name:"link"})
    .then((link)=>{
        console.log(link.link)
        res.redirect(link.link)
    })
    .catch((err)=>{
        console.log(err)
    })
});
app.listen(PORT, (err) => {
  if (err) {
    console.log("app refused to started");
  } else {
    console.log("app has started successfully");
  }
});


// LinkModel.find()
//    .then((res)=>{
//      console.log(res)
//      if(res.length === 0){
//         console.log("nothing dey here o")
//         let form = new LinkModel({link:newLink})
//         form.save()
//         .then(()=>{
//             console.log("new link has been saved")
//         })
//         .catch((err)=>{
//             console.log("new link was not changed", err)
//         })
//      }else{
//         console.log("one link don dey before")
//         LinkModel.findOneAndUpdate({name:"link"},{$set:{link:newLink}},{upsert:true,new:true})
//         .then(()=>{
//             console.log("did it work")
//         })
//         .catch((err)=>{
//             console.log("didnt work")
//         })

//      }
//    })
//    .catch((err)=>{
//      console.log(err)
//    })


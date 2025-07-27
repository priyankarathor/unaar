const mongoose = require("mongoose");

const DeveloperSchema = new mongoose.Schema({
  farmname: { type: String, required: true },
  title: { type: String, required: true },
  About: { type: String },
  year: { type: String },
  otherdetails: { type: String },
  History: { type: String },
  image: { type: String },
  imagetype: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Developer", DeveloperSchema);

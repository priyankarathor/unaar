const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // S3 URL
    imageType: { type: String },
    startdate: { type: String },
    enddate: { type: String },
    title: { type: String },
    subtitle: { type: String },
    buttonfirst: { type: String },
    buttonseconed: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Offersection", offerSchema);

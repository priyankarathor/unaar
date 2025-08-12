const mongoose = require("mongoose");

const map1Schema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // AWS S3 URL
    imageType: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Map1", map1Schema);

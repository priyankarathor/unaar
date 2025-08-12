const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema(
  {
    image: {
      type: String, // S3 URL
    },
    imageType: String,
    description: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertisement", advertisementSchema);

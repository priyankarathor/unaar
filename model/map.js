const mongoose = require("mongoose");

const map1Schema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
  status: {
    type: String,
    default: "Active",
  }
}, { timestamps: true });

module.exports = mongoose.model("Map1", map1Schema);

require("dotenv").config();
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const PropertyListing = require("../model/PropertyListing");

// configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});
const s3 = new AWS.S3();

const uploadToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const result = await s3.upload(params).promise();
  return result.Location; // public URL
};

/**
 * Create property listing (uploads images to S3)
 * Expected fields:
 * - propertyimage (files, max 5)
 * - remotelocationimage (files, max 5)
 */
const propertyListingInsert = async (req, res) => {
  try {
    // parse fields from req.body (they are strings from form-data)
    const body = req.body;

    // Validate file counts
    if (req.files?.propertyimage && req.files.propertyimage.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed for propertyimage" });
    }
    if (req.files?.remotelocationimage && req.files.remotelocationimage.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed for remotelocationimage" });
    }

    // Upload property images
    let propertyImageUrls = [];
    if (req.files?.propertyimage?.length) {
      propertyImageUrls = await Promise.all(req.files.propertyimage.map(uploadToS3));
    }

    // Upload remote location images
    let remoteLocationImageUrls = [];
    if (req.files?.remotelocationimage?.length) {
      remoteLocationImageUrls = await Promise.all(req.files.remotelocationimage.map(uploadToS3));
    }

    const newListing = new PropertyListing({
      country: body.country,
      state: body.state,
      city: body.city,
      title: body.title,
      subtitle: body.subtitle,
      fromamout: body.fromamout,
      propertylabel: body.propertylabel,
      propertyvalue: body.propertyvalue,
      descriptiontitle: body.descriptiontitle,
      descriptionlabel: body.descriptionlabel,
      descriptionvalue: body.descriptionvalue,
      description: body.description,
      facilitieid: body.facilitieid,
      facilitiedescription: body.facilitiedescription,
      featureId: body.featureId,
      latitude: body.latitude,
      longitude: body.longitude,
      locationlable: body.locationlable,
      locationvalue: body.locationvalue,
      locationvaluetitle: body.locationvaluetitle,
      locationdescription: body.locationdescription,
      apartmenttitle: body.apartmenttitle,
      apartmentlable: body.apartmentlable,
      apartmendescription: body.apartmendescription,
      remotelocationtitle: body.remotelocationtitle,
      remotelocationsubtitle: body.remotelocationsubtitle,
      tagtitle: body.tagtitle,
      Currency: body.Currency,
      nearbyPlaces: body.nearbyPlaces,
      pincode: body.pincode,
      growthrate: body.growthrate,
      loginId: body.loginId,
      status: body.status,
      developer: body.developer,
      type: body.type,
      propertyimage: propertyImageUrls,
      remotelocationimage: remoteLocationImageUrls,
    });

    const saved = await newListing.save();
    return res.status(201).json({ status: true, message: "Property created", data: saved });
  } catch (error) {
    console.error("Error inserting property:", error);
    return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

/**
 * Get all listings (formatted)
 */
const getAllPropertyListings = async (req, res) => {
  try {
    const listings = await PropertyListing.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, message: "Fetched", data: listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Fetch failed", error: err.message });
  }
};

/**
 * Get latest listing (one)
 */
const getLatestPropertyListing = async (req, res) => {
  try {
    const latest = await PropertyListing.findOne().sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ status: false, message: "No listings" });
    res.status(200).json({ status: true, message: "Latest fetched", data: latest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Fetch failed", error: err.message });
  }
};

/**
 * Get by ID
 */
const getPropertyById = async (req, res) => {
  try {
    const prop = await PropertyListing.findById(req.params.id);
    if (!prop) return res.status(404).json({ status: false, message: "Not found" });
    res.status(200).json({ status: true, data: prop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Fetch failed", error: err.message });
  }
};

/**
 * Update listing
 * - if new images are uploaded, they are uploaded to S3 and appended to arrays (optionally you can replace instead)
 * - this implementation appends new uploaded images to existing arrays
 */
const updatePropertyListing = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // If numeric fields exist, cast if necessary (example)
    if (updatedData.fromamout) updatedData.fromamout = Number(updatedData.fromamout);

    // Upload new images if present
    if (req.files?.propertyimage?.length) {
      const urls = await Promise.all(req.files.propertyimage.map(uploadToS3));
      // append to existing
      const existing = (await PropertyListing.findById(req.params.id))?.propertyimage || [];
      updatedData.propertyimage = existing.concat(urls);
    }

    if (req.files?.remotelocationimage?.length) {
      const urls = await Promise.all(req.files.remotelocationimage.map(uploadToS3));
      const existing = (await PropertyListing.findById(req.params.id))?.remotelocationimage || [];
      updatedData.remotelocationimage = existing.concat(urls);
    }

    // Update
    const updated = await PropertyListing.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updated) return res.status(404).json({ status: false, message: "Property not found" });

    res.status(200).json({ status: true, message: "Updated", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ status: false, message: "Update failed", error: err.message });
  }
};

/**
 * Delete listing
 * Note: This does NOT remove images from S3. If you want to remove S3 objects, provide code to parse keys and call s3.deleteObjects.
 */
const deletePropertyListing = async (req, res) => {
  try {
    const deleted = await PropertyListing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: false, message: "Not found" });
    res.status(200).json({ status: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ status: false, message: "Delete failed", error: err.message });
  }
};

/**
 * Filter properties (query params)
 */
const propertyfilter = async (req, res) => {
  try {
    const q = req.query;
    const query = {};

    if (q.country) query.country = q.country;
    if (q.state) query.state = q.state;
    if (q.city) query.city = q.city;
    if (q.title) query.title = { $regex: q.title, $options: "i" };

    // price range
    const min = Number(q.minPrice || NaN);
    const max = Number(q.maxPrice || NaN);
    if (!isNaN(min) || !isNaN(max)) {
      query.fromamout = {};
      if (!isNaN(min)) query.fromamout.$gte = min;
      if (!isNaN(max)) query.fromamout.$lte = max;
    }

    // add other filters similarly...
    const results = await PropertyListing.find(query).sort({ createdAt: -1 });
    res.status(200).json({ status: true, data: results });
  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).json({ status: false, message: "Filter failed", error: err.message });
  }
};

module.exports = {
  propertyListingInsert,
  getAllPropertyListings,
  getLatestPropertyListing,
  getPropertyById,
  updatePropertyListing,
  deletePropertyListing,
  propertyfilter,
};

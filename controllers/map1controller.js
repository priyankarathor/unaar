const Map1 = require("../model/map");

exports.mapAdd = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const newEntry = new Map1({
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await newEntry.save();
    res.status(201).json({ message: "Inserted successfully", data: newEntry });
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.mapGet = async (req, res) => {
  try {
    const data = await Map1.find().sort({ createdAt: -1 });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};


exports.mapGetActive = async (req, res) => {
  try {
    const data = await Map1.find({ status: 'Active' });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.mapEdit = async (req, res) => {
  try {
    const updateData = {};
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    const updated = await Map1.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
};

exports.mapDelete = async (req, res) => {
  try {
    await Map1.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Map1.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: "Status updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
};

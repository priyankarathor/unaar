const Advertise = require("../model/Advertise");

// POST - Add New Advertise
exports.AdvertiseAdd = async (req, res) => {
  try {
    const { title, description, buttontitle, link } = req.body;

    const newAdvertise = new Advertise({
      title,
      description,
      buttontitle,
      link
    });

    await newAdvertise.save();

    res.status(201).json({
      status: true,
      message: "Advertise created successfully",
      data: newAdvertise,
    });
  } catch (error) {
    console.error("Error creating advertise:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: null,
    });
  }
};

// GET - All Advertises
exports.AdvertiseGet = async (req, res) => {
  try {
    const advertises = await Advertise.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json({
      status: true,
      message: "Advertises fetched successfully",
      data: advertises,
    });
  } catch (error) {
    console.error("Error fetching advertises:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: [],
    });
  }
};

// PUT - Update Advertise by ID
exports.AdvertiseEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, buttontitle, link } = req.body;

    const updatedAdvertise = await Advertise.findByIdAndUpdate(
      id,
      { title, description, buttontitle, link },
      { new: true }
    );

    if (!updatedAdvertise) {
      return res.status(404).json({
        status: false,
        message: "Advertise not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Advertise updated successfully",
      data: updatedAdvertise,
    });
  } catch (error) {
    console.error("Error updating advertise:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: null,
    });
  }
};

// DELETE - Delete Advertise by ID
exports.AdvertiseDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdvertise = await Advertise.findByIdAndDelete(id);

    if (!deletedAdvertise) {
      return res.status(404).json({
        status: false,
        message: "Advertise not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Advertise deleted successfully",
      data: deletedAdvertise,
    });
  } catch (error) {
    console.error("Error deleting advertise:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: null,
    });
  }
};

const Developer = require("../model/Developer");

// ADD Developer
exports.developerAdd = async (req, res) => {
  try {
    const { farmname, title, About, year, otherdetails, History } = req.body;

    // Construct image URL if file is uploaded
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : null;

    const newDeveloper = new Developer({
      farmname,
      title,
      About,
      year,
      otherdetails,
      History,
      image: imageUrl, // Save image URL instead of buffer
    });

    await newDeveloper.save();

    res.status(201).json({
      status: true,
      message: "Developer added successfully",
      data: newDeveloper,
    });
  } catch (error) {
    console.error("Error adding developer:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error.message,
    });
  }
};


// GET All Developers
exports.developerGet = async (req, res) => {
  try {
    const developers = await Developer.find().sort({ createdAt: -1 });

    const developerList = developers.map((dev) => ({
      _id: dev._id,
      farmname: dev.farmname,
      title: dev.title,
      About: dev.About,
      year: dev.year,
      otherdetails: dev.otherdetails,
      History: dev.History,
      image: dev.image || null, // now it's a URL string
    }));

    res.status(200).json({
      status: true,
      message: "Developers fetched successfully",
      data: developerList,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch developers: " + error.message,
    });
  }
};

// EDIT Developer
exports.developerEdit = async (req, res) => {
  try {
    const { farmname, title, About, year, otherdetails, History } = req.body;
    const { id } = req.params;

    const developer = await Developer.findById(id);

    if (!developer) {
      return res.status(404).json({
        status: false,
        message: "Developer not found",
      });
    }

    developer.farmname = farmname;
    developer.title = title;
    developer.About = About;
    developer.year = year;
    developer.otherdetails = otherdetails;
    developer.History = History;

    if (req.file) {
      // Construct new image URL
      developer.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedDeveloper = await developer.save();

    res.status(200).json({
      status: true,
      message: "Developer updated successfully",
      data: updatedDeveloper,
    });
  } catch (error) {
    console.error("Error updating developer:", error);
    res.status(400).json({
      status: false,
      message: "Error updating developer: " + error.message,
    });
  }
};


// DELETE Developer
exports.developerDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const developer = await Developer.findByIdAndDelete(id);

    if (!developer) {
      return res.status(404).json({
        status: false,
        message: "Developer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Developer deleted successfully",
      data: developer,
    });
  } catch (error) {
    console.error("Error deleting developer:", error);
    res.status(500).json({
      status: false,
      message: "Error deleting developer: " + error.message,
    });
  }
};

const Map2Section = require("../model/map2Card");

// POST - Add Map2 Section
exports.addMap2Section = async (req, res) => {
  try {
    const {
      title,
      value1, label1,
      value2, label2,
      value3, label3,
      value4, label4,
      buttontitle,
      link
    } = req.body;

    const newSection = new Map2Section({
      title,
      value1, label1,
      value2, label2,
      value3, label3,
      value4, label4,
      buttontitle,
      link
    });

    await newSection.save();

    res.status(201).json({
      status: true,
      message: "Map2 section created successfully",
      data: newSection,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to create section: " + error.message,
      data: null,
    });
  }
};

// GET - Get all Map2 Sections
exports.getMap2Sections = async (req, res) => {
  try {
    // Assuming documents have `createdAt` or rely on `_id`'s natural order
    const section = await Map2Section.findOne().sort({ createdAt: -1 });

    if (!section) {
      return res.status(404).json({
        status: false,
        message: "No section found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Latest Map2 section fetched successfully",
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch section: " + error.message,
      data: null,
    });
  }
};


// PUT - Update Map2 Section by ID
exports.updateMap2Section = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      value1, label1,
      value2, label2,
      value3, label3,
      value4, label4,
      buttontitle,
      link
    } = req.body;

    const updatedSection = await Map2Section.findByIdAndUpdate(
      id,
      {
        title,
        value1, label1,
        value2, label2,
        value3, label3,
        value4, label4,
        buttontitle,
        link
      },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        status: false,
        message: "Section not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Map2 section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to update section: " + error.message,
      data: null,
    });
  }
};

// DELETE - Delete Map2 Section by ID
exports.deleteMap2Section = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSection = await Map2Section.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({
        status: false,
        message: "Section not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Map2 section deleted successfully",
      data: deletedSection,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to delete section: " + error.message,
      data: null,
    });
  }
};

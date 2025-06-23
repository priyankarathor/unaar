const Homesection = require("../model/herosection");

// POST - Add Home Section
exports.herosectionadd = async (req, res) => {
    try {
        const { title, subtitle, title1, title2, title3, status, popularenquirylist, enquirylink } = req.body;
        const HomeSectionData = new Homesection({ title, subtitle, title1, title2, title3, status, popularenquirylist, enquirylink });
        await HomeSectionData.save();
        res.status(201).json({
            status: true,
            message: "HomeSectionData created successfully",
            data: HomeSectionData,
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null,
        });
    }
};

// GET - Get all Home Sections
exports.homesectionget = async (req, res) => {
    try {
        const homeSections = await Homesection.find();
        res.status(200).json({
            status: true,
            message: "Home sections fetched successfully",
            data: homeSections,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: [],
        });
    }
};

// PUT - Edit Home Section by ID
exports.homesectionedit = async (req, res) => {
    try {
        const { title, subtitle, title1, title2, title3, status, popularenquirylist, enquirylink } = req.body;
        const { id } = req.params;
        const updatedHeroSection = await Homesection.findByIdAndUpdate(
            id,
            { title, subtitle, title1, title2, title3, status, popularenquirylist, enquirylink },
            { new: true }
        );

        if (!updatedHeroSection) {
            return res.status(404).json({
                status: false,
                message: "Home section not found",
                data: null,
            });
        }

        res.status(200).json({
            status: true,
            message: "Home section updated successfully",
            data: updatedHeroSection,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null,
        });
    }
};

// DELETE - Delete Home Section by ID
exports.homesectiondelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHero = await Homesection.findByIdAndDelete(id);

        if (!deletedHero) {
            return res.status(404).json({
                status: false,
                message: "Home section not found",
                data: null,
            });
        }

        res.status(200).json({
            status: true,
            message: "Home section deleted successfully",
            data: deletedHero,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null,
        });
    }
};

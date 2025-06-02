const homelayout = require("../model/Homelayout");

// POST - Add Home Section
exports.homelayoutadd = async (req, res) => {
    try {
        const { title, status} = req.body;
        const homelayoutData = new homelayout({ title, status });
        await homelayoutData.save();
        res.status(201).json({
            status: true,
            message: "homelayoutData created successfully",
            data: homelayoutData,
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
exports.homelayoutget = async (req, res) => {
    try {
        const homelayouts = await homelayout.find();
        res.status(200).json({
            status: true,
            message: "Home sections fetched successfully",
            data: homelayouts,
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
exports.homelayoutedit = async (req, res) => {
    try {
        const {title, status } = req.body;
        const { id } = req.params;
        const updatedhomelayout = await homelayout.findByIdAndUpdate(
            id,
            { title, status },
            { new: true }
        );

        if (!updatedhomelayout) {
            return res.status(404).json({
                status: false,
                message: "Home section not found",
                data: null,
            });
        }

        res.status(200).json({
            status: true,
            message: "Home section updated successfully",
            data: updatedhomelayout,
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
exports.homelayoutdelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHero = await homelayout.findByIdAndDelete(id);

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

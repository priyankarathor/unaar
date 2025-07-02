const profilelayout = require("../model/Profile");

// POST - Add Home Section
exports.profilelayoutadd = async (req, res) => {
    try {
        const { firstname, lastname, email, location, city, state, country, contactdetails, phone, password, propertyId, userrole} = req.body;
        const profilelayoutData = new profilelayout({ firstname, lastname, email, location, city, state, country, contactdetails, phone, password,  propertyId, userrole });
        await profilelayoutData.save();
        res.status(201).json({
            status: true,
            message: "profilelayoutData created successfully",
            data: profilelayoutData,
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
exports.profilelayoutget = async (req, res) => {
    try {
        const profilelayouts = await profilelayout.find();
        res.status(200).json({
            status: true,
            message: "Home sections fetched successfully",
            data: profilelayouts,
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
exports.profilelayoutedit = async (req, res) => {
    try {
        const {firstname, lastname, email, location, city, state, country, contactdetails, phone, password, propertyId, userrole } = req.body;
        const { id } = req.params;
        const updatedprofilelayout = await profilelayout.findByIdAndUpdate(
            id,
            { firstname, lastname, email, location, city, state, country, contactdetails, phone, password, propertyId, userrole },
            { new: true }
        );

        if (!updatedprofilelayout) {
            return res.status(404).json({
                status: false,
                message: "Home section not found",
                data: null,
            });
        }

        res.status(200).json({
            status: true,
            message: "Home section updated successfully",
            data: updatedprofilelayout,
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
exports.profilelayoutdelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHero = await profilelayout.findByIdAndDelete(id);

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

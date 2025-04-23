const agencies = require("../model/Agencie");

// ADD
exports.agenciesadd = async (req, res) => {
    try {
        const { image, link, agenciename } = req.body;
        const agenciedata = new agencies({ image, link, agenciename });
        await agenciedata.save();

        res.status(201).json({
            status: true,
            message: "Agency saved successfully",
            data: agenciedata
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

// GET ALL
exports.agenciesget = async (req, res) => {
    try {
        const agenciedata = await agencies.find();
        res.status(200).json({
            status: true,
            message: "Agencies fetched successfully",
            data: agenciedata
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: []
        });
    }
};

// EDIT
exports.agenciesedit = async (req, res) => {
    try {
        const { image, link, agenciename } = req.body;
        const { id } = req.params;

        const editagencies = await agencies.findByIdAndUpdate(
            id,
            { image, link, agenciename },
            { new: true }
        );

        if (!editagencies) {
            return res.status(404).json({
                status: false,
                message: "Agency not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Agency updated successfully",
            data: editagencies
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

// DELETE
exports.agenciesdelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await agencies.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                status: false,
                message: "Agency not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Agency deleted successfully",
            data: deletedUser
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

const goldenvisa = require("../model/Goldenvisa");

// ADD
exports.goldenvisaadd = async (req, res) => {
    try {
        const { title, subtitle, description, image, buttontitle } = req.body;
        const agenciedata = new goldenvisa({ title, subtitle, description, image, buttontitle });
        await agenciedata.save();

        res.status(201).json({
            status: true,
            message: "Golden Visa saved successfully",
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

// GET
exports.goldenvisaget = async (req, res) => {
    try {
        const agenciedata = await goldenvisa.find();
        res.status(200).json({
            status: true,
            message: "Golden Visa records fetched successfully",
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
exports.goldenvisaedit = async (req, res) => {
    try {
        const { title, subtitle, description, image, buttontitle } = req.body;
        const { id } = req.params;

        const editgoldenvisa = await goldenvisa.findByIdAndUpdate(
            id,
            { title, subtitle, description, image, buttontitle },
            { new: true }
        );

        if (!editgoldenvisa) {
            return res.status(404).json({
                status: false,
                message: "Golden Visa not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Golden Visa updated successfully",
            data: editgoldenvisa
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
exports.goldenvisadelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await goldenvisa.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                status: false,
                message: "Golden Visa not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Golden Visa deleted successfully",
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

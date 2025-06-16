const Enquirey = require('../model/Enquirey');

// CREATE
exports.userEnquirey = async (req, res) => {
    try {
        const { inquire, fullname, email, phoneNo, date , status, propertyId, country, state, city, type, inquireType, inquireurl, subject} = req.body;
        const Enquireydata = new Enquirey({ inquire, fullname, email, phoneNo, date , status, propertyId, country, state, city, type, inquireType, inquireurl,subject});
        await Enquireydata.save();

        res.status(201).json({
            status: true,
            message: "Inquiry generated successfully",
            data: Enquireydata
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

// READ (ALL ENTRIES)
exports.userEnquireydata = async (req, res) => {
    try {
        const enquiredata = await Enquirey.find();
        res.status(200).json({
            status: true,
            message: "Agencies fetched successfully",
            data: enquiredata
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: []
        });
    }
};

// DELETE
exports.userEnquireyDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await Enquirey.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                status: false,
                message: "User not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "User deleted successfully",
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

const Enquirey = require('../model/Enquirey');

exports.userEnquirey = async (req, res) => {
    try {
        const { inquire, fullname, email, phoneNo , date} = req.body;
        const Enquireydata = new Enquirey({ inquire, fullname, email, phoneNo , date});
        await Enquireydata.save();

        res.status(201).send('Inquiry generated successfully');
    } catch (error) {
        res.status(400).send('Something went wrong: ' + error.message);
    }
};

exports.userEnquireydata = async (req, res) => {
    try {
        const enquiredata = await Enquirey.find();
        res.status(200).json(enquiredata); 
    } catch (error) {
        res.status(400).send('Something went wrong: ' + error.message);
    }
};

exports.userEnquireyDelete = async (req, res) => { 
    try {
        const { id } = req.params;
        const deletedUser = await Enquirey.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).send("User not found");
        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        res.status(500).send("Something went wrong: " + error.message);
    }
};

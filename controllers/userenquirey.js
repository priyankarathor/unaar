const Enquirey = require('../model/Enquirey');

exports.userEnquirey = async (req, res) => {
    try {
        const { inquire, fullname, email, phoneNo } = req.body;
        const Enquireydata = new Enquirey({ inquire, fullname, email, phoneNo });
        await Enquireydata.save();

        res.status(201).send('Inquiry generated successfully');
    } catch (error) {
        res.status(400).send('Something went wrong: ' + error.message);
    }
};

exports.userEnquireydata = async (req, res) => {
    try {
        const enquiredata = await Enquirey.find();
        res.status(201).json(enquiredata);
    } catch (error) {
        res.status(400).send('Something went wrong: ' + error.message);
    }
};

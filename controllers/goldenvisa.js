const GoldenVisa = require("../model/Goldenvisa");

// ADD
exports.goldenvisaadd = async (req, res) => {
    try {
        const { title, subtitle, description, buttontitle, link } = req.body;

        const newGoldenVisa = new GoldenVisa({
            image: req.file.buffer,
            imageType: req.file.mimetype,
            title,
            subtitle,
            description,
            buttontitle,
            link,
        });

        await newGoldenVisa.save();

        res.status(201).json({
            status: true,
            message: "Golden Visa saved successfully",
            data: newGoldenVisa
        });
    } catch (error) {
        console.error(error);
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
        const goldenVisas = await GoldenVisa.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            message: "Golden Visa records fetched successfully",
            data: goldenVisas
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
        const { title, subtitle, description, buttontitle, link } = req.body;
        const { id } = req.params;

        const goldenVisa = await GoldenVisa.findById(id);

        if (!goldenVisa) {
            return res.status(404).json({
                status: false,
                message: "Golden Visa not found"
            });
        }

        if (req.file) {
            goldenVisa.image = req.file.buffer;
            goldenVisa.imageType = req.file.mimetype;
        }

        goldenVisa.title = title;
        goldenVisa.subtitle = subtitle;
        goldenVisa.description = description;
        goldenVisa.buttontitle = buttontitle;
        goldenVisa.link = link;

        const updatedGoldenVisa = await goldenVisa.save();

        res.status(200).json({
            status: true,
            message: "Golden Visa updated successfully",
            data: updatedGoldenVisa
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
        });
    }
};

// DELETE
exports.goldenvisadelete = async (req, res) => {
    try {
        const { id } = req.params;

        const goldenVisa = await GoldenVisa.findByIdAndDelete(id);

        if (!goldenVisa) {
            return res.status(404).json({
                status: false,
                message: "Golden Visa not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Golden Visa deleted successfully",
            data: goldenVisa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
        });
    }
};

// Serve the image as a blob
exports.getGoldenVisaImage = async (req, res) => {
    try {
        const { id } = req.params;
        const goldenVisa = await GoldenVisa.findById(id);

        if (!goldenVisa || !goldenVisa.image) {
            return res.status(404).send('Image not found');
        }

        res.set('Content-Type', goldenVisa.imageType || 'image/png');
        res.send(goldenVisa.image); // Sends the binary image data
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).send('Server error');
    }
};

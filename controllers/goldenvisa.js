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
            const goldenVisa = await GoldenVisa.find().sort({ createdAt: -1 });
            const visaWithImage = goldenVisa.map(golden => ({
                _id: golden._id,
                title: golden.title,
                subtitle: golden.subtitle,
                description: golden.description,
                buttontitle: golden.buttontitle,
                link: golden.link,
                image: golden.image ? {
                    data: golden.image, // Buffer
                    contentType: golden.imageType || 'image/png'
                } : null
            }));

            res.status(200).json({
                status: true,
                message: "goldenVisa fetched successfully",
                data: visaWithImage
            });
        } catch (error) {
            console.error('Fetch error:', error);
            res.status(500).json({
                status: false,
                message: "Failed to fetch offers",
                error: error.message
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


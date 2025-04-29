const Offers = require('../model/Offersection');
const fs = require('fs');
const path = require('path');
const { Blob } = require('buffer');

// INSERT OFFER
exports.offerInsert = async (req, res) => {
    try {
        const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;
        let imageFilename = null;

        if (req.file) {
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            imageFilename = Date.now() + '-' + req.file.originalname;
            fs.writeFileSync(path.join(uploadsDir, imageFilename), buffer);
        } else {
            return res.status(400).json({ status: false, message: "Image is required" });
        }

        const newOffer = new Offers({
            image: imageFilename,
            startdate,
            enddate,
            title,
            subtitle,
            buttonfirst,
            buttonseconed,
            link
        });

        await newOffer.save();

        res.status(201).json({
            status: true,
            message: "Offer inserted successfully",
            data: newOffer
        });
    } catch (error) {
        console.error('Error inserting offer:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert offer",
            error: error.message
        });
    }
};

// GET ALL OFFERS
exports.offersGet = async (req, res) => {
    try {
        const offers = await Offers.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Offers fetched successfully",
            data: offers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch offers",
            error: error.message
        });
    }
};

// EDIT OFFER
exports.offerEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

        const offer = await Offers.findById(id);
        if (!offer) {
            return res.status(404).json({
                status: false,
                message: "Offer not found"
            });
        }

        if (req.file) {
            // Delete old image
            if (offer.image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', offer.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const newImageFilename = Date.now() + '-' + req.file.originalname;
            fs.writeFileSync(path.join(uploadsDir, newImageFilename), buffer);

            offer.image = newImageFilename;
        }

        offer.startdate = startdate;
        offer.enddate = enddate;
        offer.title = title;
        offer.subtitle = subtitle;
        offer.buttonfirst = buttonfirst;
        offer.buttonseconed = buttonseconed;
        offer.link = link;

        const updatedOffer = await offer.save();

        res.status(200).json({
            status: true,
            message: "Offer updated successfully",
            data: updatedOffer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Failed to update offer",
            error: error.message
        });
    }
};

// DELETE OFFER
exports.offerDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const offer = await Offers.findByIdAndDelete(id);

        if (!offer) {
            return res.status(404).json({
                status: false,
                message: "Offer not found"
            });
        }

        // Delete image
        if (offer.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', offer.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({
            status: true,
            message: "Offer deleted successfully",
            data: offer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Failed to delete offer",
            error: error.message
        });
    }
};

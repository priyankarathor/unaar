const Offers = require('../model/Offersection'); // Model to interact with the database

// Insert a new offer
exports.offerInsert = async (req, res) => {
    try {
        const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: false, message: "Image is required" });
        }

        const newOffer = new Offers({
            image: req.file.buffer,  // Storing image buffer (binary data)
            imageType: req.file.mimetype, // Storing MIME type of the image
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

// Get all offers
    exports.offersGet = async (req, res) => {
        try {
            const offers = await Offers.find().sort({ createdAt: -1 });
    
            const offersWithImage = offers.map(offer => ({
                _id: offer._id,
                title: offer.title,
                subtitle: offer.subtitle,
                buttonfirst: offer.buttonfirst,
                buttonseconed: offer.buttonseconed,
                link: offer.link,
                startdate: offer.startdate,
                enddate: offer.enddate,
                image: offer.image ? {
                    data: offer.image, // Buffer
                    contentType: offer.imageType || 'image/png'
                } : null
            }));
            res.status(200).json({
                status: true,
                message: "Offers fetched successfully",
                data: offersWithImage
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
    
    

// Edit an offer
exports.offerEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

        const offer = await Offers.findById(id);
        if (!offer) {
            return res.status(404).json({ status: false, message: "Offer not found" });
        }

        if (req.file) {
            offer.image = req.file.buffer;
            offer.imageType = req.file.mimetype;
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

// Delete an offer
exports.offerDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const offer = await Offers.findByIdAndDelete(id);
        if (!offer) {
            return res.status(404).json({ status: false, message: "Offer not found" });
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

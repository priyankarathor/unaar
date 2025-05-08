const PropertyListing = require('../model/propertylisting');

exports.PropertyListingInsert = async (req, res) => {
    try {
        const {
            category, subcategory, subtosubcategory, title, subtitle, fromamout,
            propertylabel, propertyvalue, descriptiontitle, descriptionlabel, descriptionvalue,
            description, facilitietitle, facilitievalue, facilitiedescription, featuretitle,
            locationtitle, locationsubtitle, locationlable, locationvalue, locationvaluetitle,
            imageType, data, apartmenttitle, apartmentlable, apartmendescription,
            remotelocationtitle, remotelocationsubtitle, tagtitle
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Image is required"
            });
        }

        const imageBuffer = req.file.buffer;
        const imageMimeType = req.file.mimetype;

        const newListing = new PropertyListing({
            image: imageBuffer,
            imageType: imageMimeType,
            facilitieimage: imageBuffer,
            facilitieimagetype: imageMimeType,
            featureimage: imageBuffer,
            featureimagetype: imageMimeType,
            remotelocationimage: imageBuffer,
            remotelocationimagetype: imageMimeType,

            category,
            subcategory,
            subtosubcategory,
            title,
            subtitle,
            fromamout,
            propertylabel,
            propertyvalue,
            descriptiontitle,
            descriptionlabel,
            descriptionvalue,
            description,
            facilitietitle,
            facilitievalue,
            facilitiedescription,
            featuretitle,
            locationtitle,
            locationsubtitle,
            locationlable,
            locationvalue,
            locationvaluetitle,
            data,
            apartmenttitle,
            apartmentlable,
            apartmendescription,
            remotelocationtitle,
            remotelocationsubtitle,
            tagtitle
        });

        await newListing.save();

        res.status(201).json({
            status: true,
            message: "Property listing inserted successfully",
            data: newListing
        });

    } catch (error) {
        console.error('Error inserting property listing:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert property listing",
            error: error.message
        });
    }
};

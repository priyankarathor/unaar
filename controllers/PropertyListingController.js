const PropertyListing = require('../model/PropertyListing');

exports.PropertyListingInsert = async (req, res) => {
    try {
        const {
            category, subcategory, subtosubcategory, title, subtitle, fromamout,
            propertylabel, propertyvalue, descriptiontitle, descriptionlabel, descriptionvalue,
            description, facilitietitle, facilitievalue, facilitiedescription, featuretitle,
            locationtitle, locationsubtitle, locationlable, locationvalue, locationvaluetitle,
            data, apartmenttitle, apartmentlable, apartmendescription,
            remotelocationtitle, remotelocationsubtitle, tagtitle
        } = req.body;

        const files = req.files;

        if (!files.image || !files.facilitieimage || !files.remotelocationimage) {
            return res.status(400).json({
                status: false,
                message: "All image fields (image, facilitieimage, remotelocationimage) are required"
            });
        }

        const newListing = new PropertyListing({
            image: files.image[0].buffer,
            imageType: files.image[0].mimetype,

            facilitieimage: files.facilitieimage[0].buffer,
            facilitieimagetype: files.facilitieimage[0].mimetype,

            featureimage: files.image[0].buffer, // You may change this if `featureimage` is separate
            featureimagetype: files.image[0].mimetype,

            remotelocationimage: files.remotelocationimage[0].buffer,
            remotelocationimagetype: files.remotelocationimage[0].mimetype,

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

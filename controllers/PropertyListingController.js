const PropertyListing = require('../model/PropertyListing');

// INSERT CATEGORY
exports.PropertyListingInsert = async (req, res) => {
    try {
        const { category, subcategory, subtosubcategory, title, subtitle, fromamout, propertylabel, propertyvalue, descriptiontitle, descriptionlabel, descriptionvalue, description, facilitietitle, facilitievalue,  facilitiedescription, featuretitle, locationtitle, locationsubtitle, locationlable, locationvalue, locationvaluetitle, imageType, data, apartmenttitle, apartmentlable, apartmendescription, remotelocationtitle, remotelocationimagetype, remotelocationsubtitle, tagtitle} = req.body;

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ 
                status: false, 
                message: "Image is required" 
            });
        }

        // Create a new category with image buffer
        const newCategory = new PropertyListing({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store MIME type

            facilitieimage: req.file.buffer,        // Store image as buffer
            facilitieimagetype: req.file.mimetype,  // Store MIME type

            featureimage: req.file.buffer,        // Store image as buffer
            featureimagetype: req.file.mimetype,  // Store MIME type

            remotelocationimage: req.file.buffer,        // Store image as buffer
            remotelocationimagetype: req.file.mimetype,  // Store MIME type
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
            imageType, 
            data, 
            apartmenttitle, 
            apartmentlable, 
            apartmendescription, 
            remotelocationtitle, 
            remotelocationimagetype, 
            remotelocationsubtitle, 
            tagtitle
        });

        await newCategory.save();

        res.status(201).json({
            status: true,
            message: "Category inserted successfully",
            data: newCategory
        });
    } catch (error) {
        console.error('Error inserting category:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert category",
            error: error.message
        });
    }
};


exports.PropertyListingGet = async (req, res) => {
    try {
      const PropertyListing = await PropertyListing.find().sort({ createdAt: -1 });
  
      const PropertyListingWithImage = PropertyListing.map(category => ({
        _id: PropertyListing._id,
        category: PropertyListing.category,
        subcategory : PropertyListing.subcategory,
        subtosubcategory: PropertyListing.subtosubcategory,
        title: PropertyListing.title,
        subtitle: PropertyListing.subtitle,
        fromamout: PropertyListing.fromamout,
        propertylabel: PropertyListing.propertylabel,
        propertyvalue: PropertyListing.propertyvalue,
        descriptiontitle: PropertyListing.descriptiontitle,
        descriptionlabel: PropertyListing.descriptionlabel,
        descriptionvalue: PropertyListing.descriptionvalue,
        description: PropertyListing.description,
        facilitietitle: PropertyListing.facilitietitle,
        facilitievalue: PropertyListing.facilitievalue,
        facilitiedescription: PropertyListing.facilitiedescription,
        featuretitle: PropertyListing.featuretitle,
        locationtitle: PropertyListing.locationtitle,
        locationsubtitle: PropertyListing.locationsubtitle,
        locationvalue: PropertyListing.locationvalue,
        locationvaluetitle: PropertyListing.locationvaluetitle,
        data: PropertyListing.data,
        apartmenttitle: PropertyListing.apartmenttitle,
        apartmentlable: PropertyListing.apartmentlable,
        apartmendescription: PropertyListing.apartmendescription,
        remotelocationtitle: PropertyListing.remotelocationtitle,
        remotelocationsubtitle: PropertyListing.remotelocationsubtitle,
        tagtitle: PropertyListing.tagtitle,

        facilitieimage: PropertyListing.facilitieimage ? {
          data: PropertyListing.facilitieimage,
          contentType: PropertyListing.facilitieimagetype || 'application/octet-stream'  
        } : null,


        featureimage: PropertyListing.featureimage ? {
            data: PropertyListing.featureimage,
            contentType: PropertyListing.featureimagetype || 'application/octet-stream'  
          } : null,


          remotelocationimage: PropertyListing.remotelocationimage ? {
            data: PropertyListing.remotelocationimage,
            contentType: PropertyListing.remotelocationimagetype || 'application/octet-stream'  
          } : null,


          image: PropertyListing.image ? {
            data: PropertyListing.image,
            contentType: PropertyListing.imageType || 'application/octet-stream'  
          } : null,

        action: PropertyListing.action,
      }));
  
      res.status(200).json({
        status: true,
        message: "Categories fetched successfully",
        data: PropertyListingWithImage,
      });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch categories",
        error: error.message,
      });
    }
  };
  

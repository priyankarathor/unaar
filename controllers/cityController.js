const citydata = require('../model/City');

// INSERT city
exports.subtosubcityInsert = async (req, res) => {
    try {
        const { masterId, subcategoryId,  subtosubcategoryId, categorytype, categoryvalue, action } = req.body;

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ 
                status: false, 
                message: "Image is required" 
            });
        }

        // Create a new city with image buffer
        const newcity = new citydata({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store MIME type
            masterId,
            subcategoryId,
            subtosubcategoryId,
            categorytype,
            categoryvalue,
            action
        });

        await newcity.save();

        res.status(201).json({
            status: true,
            message: "City inserted successfully",
            data: newcity
        });
    } catch (error) {
        console.error('Error inserting City:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert city",
            error: error.message
        });
    }
};


const getContentType = (filenameOrType) => {
    const extensionMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      webp: 'image/webp',
      bmp: 'image/bmp',
      tiff: 'image/tiff',
      ico: 'image/x-icon',
    };
  
    const ext = (filenameOrType || '').split('.').pop().toLowerCase();
    return extensionMap[ext] || 'application/octet-stream';
  };

exports.subtosubcityGet = async (req, res) => {
    try {
      const categories = await citydata.find().sort({ createdAt: -1 });
  
      const categoriesWithImage = categories.map(city => ({
        _id: city._id,
        masterId: city.masterId,
        subcategoryId : city.subcategoryId,
        subtosubcategoryId : city.subtosubcategoryId ,
        categorytype: city.categorytype,
        categoryvalue: city.categoryvalue,
        image: city.image ? {
            data: city.image,
            contentType: getContentType(city.imageType || 'jpg') // default fallback
          } : null,
        action: city.action,
      }));
  
      res.status(200).json({
        status: true,
        message: "Categories fetched successfully",
        data: categoriesWithImage,
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
  

// EDIT city
exports.subtosubcityEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const {  masterId, subcategoryId, subtosubcategoryId, categorytype, categoryvalue, action } = req.body;

        const city = await citydata.findById(id);
        if (!city) {
            return res.status(404).json({
                status: false,
                message: "city not found"
            });
        }

        // If a new image is uploaded, update it
        if (req.file) {
            city.image = req.file.buffer;
            city.imageType = req.file.mimetype;
        }

        city.masterId = masterId;
        city.subcategoryId = subcategoryId;
        city.subtosubcategoryId = subtosubcategoryId;
        city.categorytype = categorytype;
        city.categoryvalue = categoryvalue;
        city.action = action;

        const updatedcity = await city.save();

        res.status(200).json({
            status: true,
            message: "city updated successfully",
            data: updatedcity
        });
    } catch (error) {
        console.error('Error updating city:', error);
        res.status(500).json({
            status: false,
            message: "Failed to update city",
            error: error.message
        });
    }
};

// DELETE city
exports.subtosubcityDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const city = await citydata.findByIdAndDelete(id);
        if (!city) {
            return res.status(404).json({
                status: false,
                message: "city not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "city deleted successfully",
            data: city
        });
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({
            status: false,
            message: "Failed to delete city",
            error: error.message
        });
    }
};

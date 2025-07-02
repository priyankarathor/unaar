const subtosubsubCategory = require('../model/SubtosubCategory');

// INSERT CATEGORY
exports.subtosubcategoryInsert = async (req, res) => {
    try {
        const { masterId, subcategoryId, mastertitle, subtitle, categorytype, categoryvalue, action } = req.body;

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ 
                status: false, 
                message: "Image is required" 
            });
        }

        // Create a new category with image buffer
        const newCategory = new subtosubsubCategory({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store MIME type
            masterId,
            subcategoryId,
            mastertitle,
            subtitle,
            categorytype,
            categoryvalue,
            action
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

exports.subtosubcategoryGet = async (req, res) => {
    try {
      const categories = await subtosubsubCategory.find().sort({ createdAt: -1 });
  
      const categoriesWithImage = categories.map(category => ({
        _id: category._id,
        masterId: category.masterId,
        subcategoryId : category.subcategoryId,
        mastertitle : category.mastertitle ,
        subtitle :  category.subtitle,
        categorytype: category.categorytype,
        categoryvalue: category.categoryvalue,
        image: category.image ? {
            data: category.image,
            contentType: getContentType(category.imageType || 'jpg') // default fallback
          } : null,
        action: category.action,
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
  

// EDIT CATEGORY
exports.subtosubcategoryEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const {  masterId, subcategoryId, mastertitle, subtitle, categorytype, categoryvalue, action } = req.body;

        const category = await subtosubsubCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        // If a new image is uploaded, update it
        if (req.file) {
            category.image = req.file.buffer;
            category.imageType = req.file.mimetype;
        }

        category.masterId = masterId;
        category.subcategoryId = subcategoryId;
        category.mastertitle = mastertitle;
        category.subtitle = subtitle;
        category.categorytype = categorytype;
        category.categoryvalue = categoryvalue;
        category.action = action;

        const updatedCategory = await category.save();

        res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            status: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};

// DELETE CATEGORY
exports.subtosubcategoryDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await subtosubsubCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            status: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};

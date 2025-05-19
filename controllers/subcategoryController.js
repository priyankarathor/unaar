const subCategory = require('../model/SubCategory');

// INSERT CATEGORY
exports.subcategoryBulkInsert = async (req, res) => {
  try {
    const categories = req.body; // expecting array of categories

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ status: false, message: "Array of categories required" });
    }

    const insertedCategories = [];

    for (const cat of categories) {
      const {
        masterId,
        mastertitle,
        categorytype,
        categoryvalue,
        action,
        image,       // base64 string here
        imageType
      } = cat;

      if (!image || !imageType) {
        return res.status(400).json({ status: false, message: "Image and imageType are required in each category" });
      }

      // convert base64 string to buffer
      const imageBuffer = Buffer.from(image, 'base64');

      const newCategory = new subCategory({
        masterId,
        mastertitle,
        categorytype,
        categoryvalue,
        action,
        image: imageBuffer,
        imageType
      });

      await newCategory.save();
      insertedCategories.push(newCategory);
    }

    res.status(201).json({
      status: true,
      message: "Categories inserted successfully",
      data: insertedCategories
    });
  } catch (error) {
    console.error("Error inserting categories:", error);
    res.status(500).json({
      status: false,
      message: "Failed to insert categories",
      error: error.message,
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
  
  exports.subcategoryGet = async (req, res) => {
    try {
      const categories = await subCategory.find().sort({ createdAt: -1 });
  
      const categoriesWithImage = categories.map(category => ({
        _id: category._id,
        masterId: category.masterId,
        mastertitle: category.mastertitle,
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
exports.subcategoryEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { masterId,mastertitle, categorytype, categoryvalue, action } = req.body;

        const category = await subCategory.findById(id);
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
        category.mastertitle = mastertitle;
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
exports.subcategoryDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await subCategory.findByIdAndDelete(id);
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

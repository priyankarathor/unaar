const Category = require('../model/category');

// INSERT CATEGORY
exports.categoryInsert = async (req, res) => {
    try {
        const { categorytype, categoryvalue, action } = req.body;

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ 
                status: false, 
                message: "Image is required" 
            });
        }

        // Create a new category with image buffer
        const newCategory = new Category({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store MIME type
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


exports.categoryGet = async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
  
      const categoriesWithImage = categories.map(category => ({
        _id: category._id,
        categorytype: category.categorytype,
        categoryvalue: category.categoryvalue,
        image: category.image ? {
          data: category.image,
          contentType: category.imageType || 'application/octet-stream'  // support all image types
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
exports.categoryEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { categorytype, categoryvalue, action } = req.body;

        const category = await Category.findById(id);
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
exports.categoryDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);
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

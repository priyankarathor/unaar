const subCategory = require('../model/SubCategory');
const axios = require('axios');


// INSERT CATEGORY
exports.subcategoryInsert = async (req, res) => {
    try {
        const { masterId, mastertitle, categorytype, categoryvalue, action } = req.body;

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ 
                status: false, 
                message: "Image is required" 
            });
        }

        const newCategory = new subCategory({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store MIME type
            masterId,
            mastertitle,
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


async function downloadImageToBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const contentType = response.headers['content-type'];
  const buffer = Buffer.from(response.data, 'binary');
  return { buffer, contentType };
}

exports.subcategoryBulkInsert = async (req, res) => {
  try {
    const categories = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ status: false, message: "Array of categories required" });
    }

    const insertedCategories = [];
    const errors = [];

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      let {
        masterId,
        mastertitle = "",
        categorytype,
        categoryvalue,
        action,
        image,
        imageType // optional if image is URL, required if base64
      } = cat;

      if (!categorytype || !categoryvalue) {
        errors.push({ index: i, message: "categorytype and categoryvalue are required" });
        continue;
      }

      if (!image) {
        errors.push({ index: i, message: "Image is required" });
        continue;
      }

      let imageBuffer;
      let resolvedImageType;

      try {
        if (image.startsWith('http://') || image.startsWith('https://')) {
          // Image is a URL — download it
          const { buffer, contentType } = await downloadImageToBuffer(image);
          imageBuffer = buffer;
          resolvedImageType = contentType;
        } else {
          // Assume base64 string — imageType required
          if (!imageType) {
            errors.push({ index: i, message: "imageType is required for base64 image data" });
            continue;
          }
          imageBuffer = Buffer.from(image, 'base64');
          resolvedImageType = imageType.trim();
        }
      } catch (err) {
        errors.push({ index: i, message: "Failed to process image: " + err.message });
        continue;
      }

      try {
        const newCategory = new subCategory({
          masterId: masterId ? masterId.trim() : undefined,
          mastertitle: mastertitle.trim(),
          categorytype: categorytype.trim(),
          categoryvalue: categoryvalue.trim(),
          action: action ? action.trim() : undefined,
          image: imageBuffer,
          imageType: resolvedImageType
        });

        await newCategory.save();
        insertedCategories.push(newCategory);
      } catch (err) {
        errors.push({ index: i, message: "DB save error: " + err.message });
      }
    }

    res.status(insertedCategories.length > 0 ? 201 : 400).json({
      status: insertedCategories.length > 0,
      message: insertedCategories.length > 0 ? "Categories inserted successfully" : "No categories inserted",
      insertedCount: insertedCategories.length,
      errors,
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

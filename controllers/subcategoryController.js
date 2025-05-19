const axios = require("axios");
const SubCategory = require("../model/SubCategory");

// Utility function to get image content-type from extension
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

// INSERT SUBCATEGORY
const subcategoryInsert = async (req, res) => {
  try {
    // Parse JSON array sent in req.body.data (stringified)
    const data = JSON.parse(req.body.data);

    const processedData = await Promise.all(
      data.map(async (item) => {
        let imageBuffer = null;
        let imageType = null;

        // Find matching uploaded file by comparing originalname to item.image
        const file = req.files?.find(f => f.originalname === item.image);

        if (file) {
          imageBuffer = file.buffer;
          imageType = file.mimetype;
        } else if (item.image && item.image.startsWith('http')) {
          // Download remote image URL
          const response = await axios.get(item.image, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(response.data, 'binary');
          imageType = response.headers['content-type'];
        }

        return {
          masterId: item.masterId,
          mastertitle: item.mastertitle,
          categorytype: item.categorytype,
          categoryvalue: item.categoryvalue,
          action: item.action,
          image: imageBuffer ? { data: imageBuffer, contentType: imageType } : undefined,
        };
      })
    );

    // Insert all processed items into DB
    const inserted = await SubCategory.insertMany(processedData);

    res.status(201).json({ message: 'Categories inserted successfully', data: inserted });
  } catch (error) {
    console.error('Error inserting categories:', error);
    res.status(500).json({ error: 'Error inserting categories' });
  }
};

// GET ALL SUBCATEGORIES
const subcategoryGet = async (req, res) => {
  try {
    const categories = await SubCategory.find().sort({ createdAt: -1 });

    const categoriesWithImage = categories.map(category => ({
      _id: category._id,
      masterId: category.masterId,
      mastertitle: category.mastertitle,
      categorytype: category.categorytype,
      categoryvalue: category.categoryvalue,
      action: category.action,
      image: category.image ? {
        data: category.image.data,
        contentType: category.image.contentType || getContentType(category.imageType || 'jpg'),
      } : null
    }));

    res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: categoriesWithImage
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};

// EDIT SUBCATEGORY
const subcategoryEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { masterId, mastertitle, categorytype, categoryvalue, action, image } = req.body;

    const category = await SubCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found"
      });
    }

    // Update image if new one is uploaded
    if (req.file) {
      category.image = { data: req.file.buffer, contentType: req.file.mimetype };
      category.imageType = req.file.mimetype;
    } else if (image && typeof image === 'string') {
      const response = await axios.get(image, { responseType: 'arraybuffer' });
      category.image = { data: Buffer.from(response.data, 'binary'), contentType: response.headers['content-type'] };
      category.imageType = response.headers['content-type'];
    }

    // Update other fields
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

// DELETE SUBCATEGORY
const subcategoryDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await SubCategory.findByIdAndDelete(id);
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

module.exports = {
  subcategoryInsert,
  subcategoryGet,
  subcategoryEdit,
  subcategoryDelete,
};

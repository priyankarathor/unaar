const Blog = require("../model/Blog");  // Use uppercase 'Blog' as convention for models

// ADD a new blog
exports.blogadd = async (req, res) => {
  try {
    const {
      title, subtitle, description,
      categorylable, categoryValue, categoryType,
      action, date, categorytitle, authername,
      metatitle, metadescription, metakeyword
    } = req.body;

    const newBlog = new Blog({
      image: req.file?.buffer,
      imageType: req.file?.mimetype,
      title,
      subtitle,
      description,
      categorylable,
      categoryValue,
      categoryType,
      action,
      date,
      categorytitle,
      authername,
      metatitle,
      metadescription,
      metakeyword
    });

    await newBlog.save();

    res.status(201).json({
      status: true,
      message: "Blog saved successfully",
      data: newBlog
    });
  } catch (error) {
    console.error("Blog add error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: null
    });
  }
};

// GET all blogs
exports.blogget = async (req, res) => {
  try {
    const blogData = await Blog.find().sort({ createdAt: -1 });

    const blogWithImage = blogData.map(item => ({
      _id: item._id,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      categorylable: item.categorylable,
      categoryValue: item.categoryValue,
      categoryType: item.categoryType,
      action: item.action,
      date: item.date,
      categorytitle: item.categorytitle,
      authername: item.authername,
      metatitle: item.metatitle,
      metadescription: item.metadescription,
      metakeyword: item.metakeyword,
      image: item.image ? {
        data: item.image,
        contentType: item.imageType || 'image/png'
      } : null
    }));

    res.status(200).json({
      status: true,
      message: "Blogs fetched successfully",
      data: blogWithImage
    });
  } catch (error) {
    console.error('Fetch blogs error:', error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
};

// EDIT a blog by ID
exports.blogedit = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog by id
    const blogData = await Blog.findById(id);
    if (!blogData) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    // Update allowed fields if present
    const fieldsToUpdate = [
      "title", "subtitle", "description",
      "categorylable", "categoryValue", "categoryType",
      "action", "date", "categorytitle", "authername",
      "metatitle", "metadescription", "metakeyword", "status"
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        blogData[field] = req.body[field];
      }
    });

    // Update image if new file provided
    if (req.file) {
      blogData.image = req.file.buffer;
      blogData.imageType = req.file.mimetype;
    }

    // Save updated blog
    const updatedBlog = await blogData.save();

    res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });
  } catch (error) {
    console.error("Blog edit error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

// DELETE a blog by ID
exports.blogdelete = async (req, res) => {
  try {
    const { id } = req.params;

    const blogData = await Blog.findByIdAndDelete(id);

    if (!blogData) {
      return res.status(404).json({
        status: false,
        message: "Blog not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Blog deleted successfully",
      data: blogData
    });
  } catch (error) {
    console.error("Blog delete error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
    });
  }
};

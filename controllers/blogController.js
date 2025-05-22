const blog = require("../model/Blog");

// ADD
exports.blogadd = async (req, res) => {
    try {
        const { title, subtitle, description,categorylable, categoryValue, categoryType, action, date,categorytitle,authername, metatitle, metadescription, metakeyword} = req.body;

        const newblog = new blog({
            image: req.file.buffer,
            imageType: req.file.mimetype,
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

        await newblog.save();

        res.status(201).json({
            status: true,
            message: "Blog  saved successfully",
            data: newblog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

// GET
    exports.blogget = async (req, res) => {
        try {
            const blogdata = await blog.find().sort({ createdAt: -1 });
            const blogWithImage = blogdata.map(blogdata => ({
                _id: blogdata._id,
                title: blogdata.title,
                subtitle: blogdata.subtitle,
                description: blogdata.description,
                categorylable: blogdata.categorylable,
                categoryValue: blogdata.categoryValue,
                categoryType: blogdata.categoryType,
                description: blogdata.description,
                action: blogdata.action,
                date: blogdata.date,
                categorytitle: blogdata.categorytitle,
                authername: blogdata.authername,
                metatitle: blogdata.metatitle,
                metadescription: blogdata.metadescription,
                metakeyword: blogdata.metakeyword,
                image: blogdata.image ? {
                    data: blogdata.image, // Buffer
                    contentType: blogdata.imageType || 'image/png'
                } : null
            }));

            res.status(200).json({
                status: true,
                message: "Blog fetched successfully",
                data: blogWithImage
            });
        } catch (error) {
            console.error('Fetch error:', error);
            res.status(500).json({
                status: false,
                message: "Failed to fetch offers",
                error: error.message
            });
        }
    };
    
    // EDIT
exports.blogedit = async (req, res) => {
  try {
    const { id } = req.params;

    // DEBUG: Log incoming body and file
    console.log("Incoming body:", req.body);
    console.log("Incoming file:", req.file);

    // Find blog
    const blogData = await Blog.findById(id);
    if (!blogData) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    // Update fields if they are provided
    const fieldsToUpdate = [
      "title", "subtitle", "description", "categorylable", "categoryValue",
      "categoryType", "action", "date", "categorytitle", "authername",
      "metatitle", "metadescription", "metakeyword", "status"
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        blogData[field] = req.body[field];
      }
    });

    // Handle image update
    if (req.file) {
      blogData.image = req.file.buffer;
      blogData.imageType = req.file.mimetype;
    }

    // Save updated blog
    const updatedBlog = await blogData.save();

    // Return success response
    res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      data: {
        ...updatedBlog.toObject(),
        image: updatedBlog.image?.toString('base64') || null, // optional
      },
    });

  } catch (error) {
    console.error("Blog edit error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};



// DELETE
exports.blogdelete = async (req, res) => {
    try {
        const { id } = req.params;

        const blogdata = await blog.findByIdAndDelete(id);

        if (!blogdata) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Blog deleted successfully",
            data: blogdata
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
        });
    }
};
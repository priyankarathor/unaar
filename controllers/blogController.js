const blog = require("../model/Blog");

// ADD
exports.blogadd = async (req, res) => {
    try {
        const { title, subtitle, description, action, date,categorytitle } = req.body;

        const newblog = new blog({
            image: req.file.buffer,
            imageType: req.file.mimetype,
            title,
            subtitle,
            description,
            action,
            date,
            categorytitle
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
                action: blogdata.action,
                date: blogdata.date,
                categorytitle: blogdata.categorytitle,
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
        const { title, subtitle, description, action, date, categorytitle } = req.body;
        const { id } = req.params;

        const blogdata = await blog.findById(id);

        if (!blogdata) {
            return res.status(404).json({
                status: false,
                message: "Blog Data not found"
            });
        }

        if (req.file) {
            blogdata.image = req.file.buffer;
            blogdata.imageType = req.file.mimetype;
        }

        blogdata.title = title;
        blogdata.subtitle = subtitle;
        blogdata.description = description;
        blogdata.action = action;
        blogdata.date = date;
        blogdata.categorytitle = categorytitle;

        const updatedblogdata = await blogdata.save();

        res.status(200).json({
            status: true,
            message: "Blog updated successfully",
            data: updatedblogdata
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
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
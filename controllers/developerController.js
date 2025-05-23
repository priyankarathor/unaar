const Developer = require("../model/Developer");

// ADD
exports.developeradd = async (req, res) => {
    try {
        const { farmname, title, About, year, otherdetails, History,  } = req.body;

        const newDeveloper = new Developer({
            image: req.file.buffer,
            imageType: req.file.mimetype,
            farmname,
            title,
            About,
            year,
            otherdetails,
            History,
        });

        await newDeveloper.save();

        res.status(201).json({
            status: true,
            message: "newDeveloper saved successfully",
            data: newDeveloper
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
    exports.developerget = async (req, res) => {
        try {
            const developer = await Developer.find().sort({ createdAt: -1 });
            const developerWithImage = developer.map(developer => ({
                _id: developer._id,
                farmname: developer.farmname,
                title: developer.title,
                About: developer.About,
                year: developer.year,
                otherdetails: developer.otherdetails,
                History: developer.History,
                image: developer.image ? {
                    data: developer.image, // Buffer
                    contentType: developer.imageType || 'image/png'
                } : null
            }));

            res.status(200).json({
                status: true,
                message: "developer fetched successfully",
                data: developerWithImage
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
exports.developeredit = async (req, res) => {
    try {
       const { farmname, title, About, year, otherdetails, History  } = req.body;
        const { id } = req.params;

        const developer = await Developer.findById(id);

        if (!developer) {
            return res.status(404).json({
                status: false,
                message: "Developer not found"
            });
        }

        if (req.file) {
            developer.image = req.file.buffer;
            developer.imageType = req.file.mimetype;
        }

        developer.farmname = farmname;
        developer.title = title;
        developer.About = About;
        developer.year = year;
        developer.otherdetails = otherdetails;
        developer.History = History;

        const updateddeveloper = await developer.save();

        res.status(200).json({
            status: true,
            message: "Golden Visa updated successfully",
            data: updateddeveloper
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
exports.developerdelete = async (req, res) => {
    try {
        const { id } = req.params;

        const developer = await Developer.findByIdAndDelete(id);

        if (!developer) {
            return res.status(404).json({
                status: false,
                message: " developer not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "developer deleted successfully",
            data: developer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
        });
    }
};
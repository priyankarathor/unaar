const Adverticement = require("../model/adverticement"); // Make sure the model path is correct

// ADD Adverticement
exports.adverticementadd = async (req, res) => {
    try {
        const { description, status } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Image is required"
            });
        }

        const newadverticement = new Adverticement({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store image MIME type
            description,
            status
        });

        await newadverticement.save();

        res.status(201).json({
            status: true,
            message: "adverticement inserted successfully",
            data: newadverticement
        });
    } catch (error) {
        console.error("Error inserting adverticement:", error);
        res.status(500).json({
            status: false,
            message: "Failed to insert adverticement",
            error: error.message
        });
    }
};

// GET ALL adverticement
exports.adverticementget = async (req, res) => {
    try {
      const adverticementList = await adverticement.find().sort({ createdAt: -1 });
  
      const adverticementListWithImage = Adverticement.map(agency => ({
        _id: agency._id,
        image: agency.image ? {
            data: agency.image, 
            contentType: agency.imageType || 'image/png'
        } : null,
        link: agency.link,
        agenciename: agency.agenciename,
        status : agency.status
      }));
  
      res.status(200).json({
        status: true,
        message: "Adverticement fetched successfully",
        data: adverticementListWithImage,
      });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch Adverticement",
        error: error.message,
      });
    }
  };
  
    

// EDIT AGENCY
exports.adverticementedit = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, status } = req.body; // Make sure to include 'status'

        const agency = await Adverticement.findById(id);
        if (!agency) {
            return res.status(404).json({
                status: false,
                message: "Adverticement not found"
            });
        }

        // Update image if a new one is uploaded
        if (req.file) {
            agency.image = req.file.buffer;
            agency.imageType = req.file.mimetype;
        }

        // Update other fields
        agency.description = description || agency.description;
        agency.status = status || agency.status;

        const updatedAgency = await agency.save();

        res.status(200).json({
            status: true,
            message: "Adverticement updated successfully",
            data: updatedAgency
        });

    } catch (error) {
        console.error("Error updating Adverticement:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update Adverticement",
            error: error.message
        });
    }
};


// DELETE AGENCY
exports.adverticementdelete = async (req, res) => {
    try {
        const { id } = req.params;

        const agency = await Adverticement.findByIdAndDelete(id);
        if (!agency) {
            return res.status(404).json({
                status: false,
                message: "description not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Adverticement deleted successfully",
            data: agency
        });
    } catch (error) {
        console.error("Error deleting Adverticement:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete Adverticement",
            error: error.message
        });
    }
};



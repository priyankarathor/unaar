const Agencies = require("../model/Agencie"); // Make sure the model path is correct

// ADD AGENCY
exports.agenciesadd = async (req, res) => {
    try {
        const { link, agenciename, status } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Image is required"
            });
        }

        const newAgency = new Agencies({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store image MIME type
            link,
            agenciename,
            status
        });

        await newAgency.save();

        res.status(201).json({
            status: true,
            message: "Agency inserted successfully",
            data: newAgency
        });
    } catch (error) {
        console.error("Error inserting agency:", error);
        res.status(500).json({
            status: false,
            message: "Failed to insert agency",
            error: error.message
        });
    }
};

// GET ALL AGENCIES
exports.agenciesget = async (req, res) => {
    try {
      const agenciesList = await Agencies.find().sort({ createdAt: -1 });
  
      const agenciesListWithImage = agenciesList.map(agency => ({
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
        message: "Agencies fetched successfully",
        data: agenciesListWithImage,
      });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch Agencies",
        error: error.message,
      });
    }
  };
  
    

// EDIT AGENCY
exports.agenciesedit = async (req, res) => {
    try {
        const { id } = req.params;
        const { link, agenciename, status } = req.body; // Make sure to include 'status'

        const agency = await Agencies.findById(id);
        if (!agency) {
            return res.status(404).json({
                status: false,
                message: "Agency not found"
            });
        }

        // Update image if a new one is uploaded
        if (req.file) {
            agency.image = req.file.buffer;
            agency.imageType = req.file.mimetype;
        }

        // Update other fields
        agency.link = link || agency.link;
        agency.agenciename = agenciename || agency.agenciename;
        agency.status = status || agency.status;

        const updatedAgency = await agency.save();

        res.status(200).json({
            status: true,
            message: "Agency updated successfully",
            data: updatedAgency
        });

    } catch (error) {
        console.error("Error updating agency:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update agency",
            error: error.message
        });
    }
};


// DELETE AGENCY
exports.agenciesdelete = async (req, res) => {
    try {
        const { id } = req.params;x

        const agency = await Agencies.findByIdAndDelete(id);
        if (!agency) {
            return res.status(404).json({
                status: false,
                message: "Agency not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Agency deleted successfully",
            data: agency
        });
    } catch (error) {
        console.error("Error deleting agency:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete agency",
            error: error.message
        });
    }
};



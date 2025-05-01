const Investment = require('../model/Investment');

// INSERT Investment
exports.Investeradd = async (req, res) => {
    try {
        const { title, subtitle, description, buttontitle, date } = req.body;

        const newInvestment = new Investment({
            image: req.file?.buffer,
            imageType: req.file?.mimetype,
            title,
            subtitle,
            description,
            buttontitle,
            date
        });

        await newInvestment.save();

        res.status(201).json({
            status: true,
            message: "Investment inserted successfully",
            data: newInvestment
        });
    } catch (error) {
        console.error('Error inserting Investment:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert Investment",
            error: error.message
        });
    }
};


// Get all InvestmentGet
    exports.InvestmentGet = async (req, res) => {
        try {
            const investments = await Investment.find().sort({ createdAt: -1 });
    
            const investmentsWithImage = investments.map(investment => ({
                _id: investment._id,
                title: investment.title,
                subtitle: investment.subtitle,
                description: investment.description,
                buttontitle: investment.buttontitle,
                date: investment.date,
                createdAt: investment.createdAt,
                updatedAt: investment.updatedAt,
                image: investment.image ? {
                    data: investment.image, // Buffer
                    contentType: investment.imageType || 'image/png'
                } : null
            }));
    
            res.status(200).json({
                status: true,
                message: "investments fetched successfully",
                data: investmentsWithImage
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

// EDIT Investment
exports.InvestmentEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, description, buttontitle, date } = req.body;

        const investment = await Investment.findById(id);
        if (!investment) {
            return res.status(404).json({
                status: false,
                message: "Investment not found"
            });
        }

        // Update fields
        investment.title = title;
        investment.subtitle = subtitle;
        investment.description = description;
        investment.buttontitle = buttontitle;
        investment.date = date;

        // Update image if new one is uploaded
        if (req.file) {
            investment.image = req.file.buffer;
            investment.imageType = req.file.mimetype;
        }

        const updatedInvestment = await investment.save();

        res.status(200).json({
            status: true,
            message: "Investment updated successfully",
            data: updatedInvestment
        });
    } catch (error) {
        console.error('Error updating Investment:', error);
        res.status(500).json({
            status: false,
            message: "Failed to update Investment",
            error: error.message
        });
    }
};

// DELETE Investment
exports.InvestmentDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const investment = await Investment.findByIdAndDelete(id);
        if (!investment) {
            return res.status(404).json({
                status: false,
                message: "Investment not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Investment deleted successfully",
            data: investment
        });
    } catch (error) {
        console.error('Error deleting Investment:', error);
        res.status(500).json({
            status: false,
            message: "Failed to delete Investment",
            error: error.message
        });
    }
};
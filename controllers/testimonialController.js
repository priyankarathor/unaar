const Testimonial = require('../model/Testimonial');
const fs = require('fs');
const path = require('path');
const { Blob } = require('buffer');

// INSERT Testimonial
exports.Testimonialadd = async (req, res) => {
    try {
        const { Name, email, designation, message, star, date } = req.body;
        let imageFilename = null;

        if (req.file) {
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            imageFilename = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(uploadsDir, imageFilename), buffer);
        }

        const newTestimonial = new Testimonial({
            Name,
            email,
            designation,
            message,
            star,
            image: imageFilename,
            date
        });

        await newTestimonial.save();

        res.status(201).json({
            status: true,
            message: "Testimonial inserted successfully",
            data: newTestimonial
        });
    } catch (error) {
        console.error('Error inserting Testimonial:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert Testimonial",
            error: error.message
        });
    }
};

// GET ALL Testimonials
exports.TestimonialGet = async (req, res) => {
    try {
        const Testimonials = await Testimonial.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Testimonials fetched successfully",
            data: Testimonials
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch Testimonials",
            error: error.message
        });
    }
};

// EDIT Testimonial
exports.TestimonialEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, email, designation, message, star, date } = req.body;

        const Testimonial = await Testimonial.findById(id);
        if (!Testimonial) {
            return res.status(404).json({
                status: false,
                message: "Testimonial not found"
            });
        }

        if (req.file) {
            // Delete old image
            if (Testimonial.image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', Testimonial.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const newImageFilename = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(uploadsDir, newImageFilename), buffer);
            Testimonial.image = newImageFilename;
        }

        Testimonial.Name = Name;
        Testimonial.email = email;
        Testimonial.designation = designation;
        Testimonial.message = message;
        Testimonial.star = star;
        Testimonial.date = date;

        const updatedTestimonial = await Testimonial.save();

        res.status(200).json({
            status: true,
            message: "Testimonial updated successfully",
            data: updatedTestimonial
        });
    } catch (error) {
        console.error('Error updating Testimonial:', error);
        res.status(500).json({
            status: false,
            message: "Failed to update Testimonial",
            error: error.message
        });
    }
};

// DELETE Testimonial
exports.TestimonialDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const Testimonial = await Testimonial.findByIdAndDelete(id);

        if (!Testimonial) {
            return res.status(404).json({
                status: false,
                message: "Testimonial not found"
            });
        }

        if (Testimonial.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', Testimonial.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({
            status: true,
            message: "Testimonial deleted successfully",
            data: Testimonial
        });
    } catch (error) {
        console.error('Error deleting Testimonial:', error);
        res.status(500).json({
            status: false,
            message: "Failed to delete Testimonial",
            error: error.message
        });
    }
};

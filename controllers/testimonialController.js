const Testimonial = require('../model/Testimonial');

// INSERT Testimonial
exports.Testimonialadd = async (req, res) => {
    try {
        const { Name, email, designation, message, star, date } = req.body;

        const newTestimonial = new Testimonial({
            image: req.file?.buffer,
            imageType: req.file?.mimetype,
            Name,
            email,
            designation,
            message,
            star,
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
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Testimonials fetched successfully",
            data: testimonials
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

// GET ALL Testimonials
exports.TestimonialGet = async (req, res) => {
        try {
            const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    
            const testimonialsWithImage = testimonials.map(testimonial => ({
                _id: testimonial._id,
                Name: testimonial.Name,
                email: testimonial.email,
                designation: testimonial.designation,
                message: testimonial.message,
                star: testimonial.star,
                date: testimonial.date,
                image: testimonial.image ? {
                    data: testimonial.image, // Buffer
                    contentType: testimonial.imageType || 'image/png'
                } : null
            }));
    
            res.status(200).json({
                status: true,
                message: "testimonial fetched successfully",
                data: testimonialsWithImage
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
    
// EDIT Testimonial
exports.TestimonialEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, email, designation, message, star, date } = req.body;

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({
                status: false,
                message: "Testimonial not found"
            });
        }

        testimonial.Name = Name;
        testimonial.email = email;
        testimonial.designation = designation;
        testimonial.message = message;
        testimonial.star = star;
        testimonial.date = date;

        if (req.file) {
            testimonial.image = req.file.buffer;
            testimonial.imageType = req.file.mimetype;
        }

        const updatedTestimonial = await testimonial.save();

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

        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            return res.status(404).json({
                status: false,
                message: "Testimonial not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Testimonial deleted successfully",
            data: testimonial
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

// GET Testimonial Image
exports.getTestimonialImage = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);

        if (!testimonial || !testimonial.image) {
            return res.status(404).send("Image not found");
        }

        res.set("Content-Type", testimonial.imageType);
        res.send(testimonial.image);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to retrieve image");
    }
};

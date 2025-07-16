require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require("cors");
const connectDB = require('./Server/Connection');


const dotenv = require('dotenv');

dotenv.config();

// Route Imports
const exchangeRoutes = require('./routes/exchangeRoutes');
require('./cron/currencyJob');



const userRoutes = require("./routes/userRoutes");
const enquiryRoutes = require("./routes/enquireyRoutes");
const agencyRoutes = require("./routes/agencieRoutes");
const goldenVisaRoutes = require("./routes/goldenvisaRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const heroSectionRoutes = require("./routes/herosectionRoutes");
const offerRoutes = require("./routes/offerRouter");
const advertisementRoutes = require("./routes/advertiseRoutes");
const testimonialRoutes = require("./routes/testiminialRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const blogRoutes = require("./routes/blogRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const subToSubcategoryRoutes = require("./routes/subtosubcategoryRoutes");
const propertyListingRoutes = require("./routes/propertyListingRoutes");
const cityRoutes = require("./routes/cityRouter");
const developerRoutes = require("./routes/developerRoutes");
const locationRoutes = require("./routes/locationRoutes");
const csvRoutes = require("./routes/CSVRoutes");
const profileRoutes = require("./routes/ProfileRoutes");
const homeRoutes = require("./routes/homeRoutes");
const adverticement = require("./routes/adverticementRoutes");
const propertybanner = require("./routes/propertybannerRoutes");
const mapRoutes = require('./routes/map1Routes');
const cardMapRoutes = require('./routes/map2CardRoutes');

// const uploads = require("./uploads");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));


// Connect to Database
connectDB();

// Root Route
app.get("/", (req, res) => {
  res.send("API is working");
});
require('./cron/currencyJob');

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/goldenvisa", goldenVisaRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/herosection", heroSectionRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/advertisement", advertisementRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/investment", investmentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/subtosubcategory", subToSubcategoryRoutes);
app.use("/api/property", propertyListingRoutes);
app.use("/api/city", cityRoutes);
app.use("/api/developer", developerRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/adverticement", adverticement);
app.use("/api/propertybanner",propertybanner);
app.use("/api/mapRoutes",mapRoutes);
app.use("/api/Map2Routes",cardMapRoutes);
app.use('/api/exchange', exchangeRoutes);

// app.use('/uploads', express.static('uploads'));

// Server Listener
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

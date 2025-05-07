require("dotenv").config();
const express = require('express');
const path = require('path'); // <<== ADD THIS
const connectDB = require('./Server/Connection');
const userRoutes = require("./routes/userRoutes");
const EnquireyRoutes = require("./routes/enquireyRoutes");
const agencies = require("./routes/agencieRoutes");
const goldenvisa = require("./routes/goldenvisaRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const herosectionRoutes = require("./routes/herosectionRoutes");
const offersectionRoutes = require("./routes/offerRouter");
const advertiseRoutes = require("./routes/advertiseRoutes");
const testiminialRoutes = require("./routes/testiminialRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const blogRoutes = require("./routes/blogRoutes");

const subcategoryRoutes = require("./routes/subcategoryRoutes");

const subtosubcategoryRoutes = require("./routes/subtosubcategoryRoutes");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/uploads', express.static(path.join(__dirname, './uploads'))); 


app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/users", userRoutes);
app.use("/api/enquirey", EnquireyRoutes);
app.use("/api/agencies", agencies);
app.use("/api/goldenvisa", goldenvisa);
app.use("/api/category", categoryRoutes);
app.use("/api/herosection" , herosectionRoutes);
app.use("/api/offer",offersectionRoutes);
app.use("/api/adverisement",advertiseRoutes);
app.use("/api/testimonial",testiminialRoutes);
app.use("/api/investment",investmentRoutes);
app.use("/api/blog",blogRoutes);
app.use("/api/subcategory",subcategoryRoutes);
app.use("/api/subtosubcategory",subtosubcategoryRoutes);

app.listen(process.env.PORT || 8001, () => console.log("Server started on port 8001"));

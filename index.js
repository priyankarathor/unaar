require("dotenv").config();
const express = require('express');
const connectDB = require('./Server/Connection');
const userRoutes = require("./routes/userRoutes");
const EnquireyRoutes = require("./routes/enquireyRoutes");
const agencies = require("./routes/agencieRoutes");
const goldenvisa = require("./routes/goldenvisaRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/users", userRoutes);
app.use("/api/enquirey", EnquireyRoutes);
app.use("/api/agencies",agencies);
app.use("/api/goldenvisa",goldenvisa);
app.use("/api/category",categoryRoutes);

app.listen(process.env.PORT || 8001, () => console.log("Server started 8001"));

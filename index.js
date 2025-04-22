require("dotenv").config();
const express = require('express');
const connectDB = require('./Server/Connection');
const userRoutes = require("./routes/userRoutes");
const EnquireyRoutes = require("./routes/enquireyRoutes");


const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/users", userRoutes);
app.use("/api/enquirey", EnquireyRoutes);

app.listen(process.env.PORT || 8005, () => console.log("Server started"));

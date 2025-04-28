require("dotenv").config();
const express = require('express');
const path = require('path'); // <<== ADD THIS
const connectDB = require('./Server/Connection');
const userRoutes = require("./routes/userRoutes");
const EnquireyRoutes = require("./routes/enquireyRoutes");
const agencies = require("./routes/agencieRoutes");
const goldenvisa = require("./routes/goldenvisaRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");
const upload = require('./uploads');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Static route for uploaded images
app.use('/uploads', express.static('uploads'));

// Route
app.post('/category-insert', upload.single('image'), categoryInsert);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
  } else if (err) {
      return res.status(500).json({ message: err.message });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/users", userRoutes);
app.use("/api/enquirey", EnquireyRoutes);
app.use("/api/agencies", agencies);
app.use("/api/goldenvisa", goldenvisa);
app.use("/api/category", categoryRoutes);

app.listen(process.env.PORT || 8001, () => console.log("Server started on port 8001"));

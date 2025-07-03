const mongoose = require('mongoose');

const uri = 'mongodb+srv://unaarNewProject:A1g8CJ3Cj0PfYQGy@unaarproject01.sug5zje.mongodb.net/?retryWrites=true&w=majority&appName=unaarProject01';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

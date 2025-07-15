const mongoose = require('mongoose');


const uri = 'mongodb+srv://unaarproject:3fCw44WjwkfZkdSa@unaarproject01.sug5zje.mongodb.net/?retryWrites=true&w=majority&appName=unaarProject01';
const connectDB = async () => {
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch((err) => console.error('Connection error:', err));
};

module.exports = connectDB;

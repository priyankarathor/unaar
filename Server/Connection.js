const mongoose = require('mongoose');


const uri = 'mongodb+srv://unaarproject:VTf!3_idEHBnGV2@unaarproject01.sug5zje.mongodb.net/?retryWrites=true&w=majority&appName=unaarProject01';
const connectDB = async () => {
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch((err) => console.error('Connection error:', err));
};

module.exports = connectDB;

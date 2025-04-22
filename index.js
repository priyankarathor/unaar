const express = require('express');
const connectDB = require('./Server/Connection');
const User = require('./model/user'); 
const app = express();
app.use(express.json());
connectDB();


app.get("/", (req,res) =>{
    res.send("use data find successfully");
})


app.post("/login", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
});

app.get("/logindata", async (req, res) => {
    try {
      const usersdata = await User.find(); 
      res.status(201).json(usersdata);
    } catch (error) {
      res.status(404).send("Something went wrong: " + error.message);
    }
    res.send("Demo data set Connected successfully");
  });

  app.put("/editlogindata/:id", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const { id } = req.params;
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, password, role },
        { new: true } // returns the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
  
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(500).send("Something went wrong: " + error.message);
    }
  });

  app.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).send("User not found");
      }
  
      res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      res.status(500).send("Something went wrong: " + error.message);
    }
  });
  
app.listen(8005, () => console.log("Server started on port 8005"));

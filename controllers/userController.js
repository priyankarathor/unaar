const User = require("../model/user");

//post 
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
};

//get
exports.registerUserdata = async (req, res) => {
  try {
    const usersdata = await User.find(); 
    res.status(200).json(usersdata);
  } catch (error) {
    res.status(404).send("Something went wrong: " + error.message);
  }
};

//edit
exports.registerUseredit = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send("User not found");
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
};

//delete
exports.registerUserdelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).send("User not found");
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
};

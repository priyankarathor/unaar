const User = require("../model/user");

// POST - Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: null,
    });
  }
};

// GET - All Users
exports.registerUserdata = async (req, res) => {
  try {
    const usersdata = await User.find();
    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: usersdata,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: [],
    });
  }
};

// PUT - Edit User
exports.registerUseredit = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: null,
    });
  }
};

// DELETE - Delete User
exports.registerUserdelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
      data: null,
    });
  }
};

const User = require("../model/user");

const Jwt = require('jsonwebtoken');
const jwtKey = 'unnar-admin'; // secret key for JWT

//check user 
// POST - Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. If user doesn't exist
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // 3. If password doesn't match (you should hash passwords in production)
    if (user.password !== password) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = Jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        accessrole: user.accessrole
      },
      jwtKey,
      { expiresIn: '3h' }
    );
    // 4. User exists and password matches
    res.status(200).json({
      status: true,
      message: "Login successful",
      data: user,
      token
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message,
    });
  }
};



//Post API


// POST - Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, accessrole } = req.body;

    // Create new user document
    const user = new User({ name, email, password, role, accessrole });
    await user.save();

    // Gene rate JWT token (valid for 3 hours)
    const token = Jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        accessrole: user.accessrole
      },
      jwtKey,
      { expiresIn: '3h' }
    );

    // Send JSON response including user data and token
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: user,
      token: token,  // <-- send token here
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
    const { name, email, password, role ,accessrole } = req.body;
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, role , accessrole},
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

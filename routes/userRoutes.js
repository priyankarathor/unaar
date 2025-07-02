const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerUserdata,
  registerUseredit,
  registerUserdelete,
  loginUser
} = require("../controllers/userController");

//API for check user
router.post("/login", loginUser);
router.post("/register", registerUser);

router.get("/logindata", registerUserdata);
router.put("/editlogindata/:id", registerUseredit);
router.delete("/delete/:id", registerUserdelete);

module.exports = router;

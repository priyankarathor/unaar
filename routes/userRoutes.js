const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerUserdata,
  registerUseredit,
  registerUserdelete
} = require("../controllers/userController");

router.post("/register", registerUser);
router.get("/logindata", registerUserdata);
router.put("/editlogindata/:id", registerUseredit);
router.delete("/delete/:id", registerUserdelete);

module.exports = router;

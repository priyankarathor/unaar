const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {
  categoryinsert,
  categoryget,
  categoryedit,
  categorydelete
} = require("../controllers/CategoryController");

router.post("/categoryinsertdata", upload.single("image"), categoryinsert);
router.get("/categoryget", categoryget);
router.put("/editcategory/:id", upload.single("image"), categoryedit);
router.delete("/deletecategory/:id", categorydelete);

module.exports = router;

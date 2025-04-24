const express = require("express");
const  router = express.Router();

const {categoryinsert,categoryget,categoryedit,categorydelete} = require("../controllers/CategoryController");

router.post("/categoryinsertdata",categoryinsert);
router.get("/categoryget",categoryget);
router.put("/editcategory/:id",categoryedit);
router.delete("/deletecategory/:id",categorydelete);
module.exports = router;
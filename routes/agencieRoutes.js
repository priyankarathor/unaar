const express = require("express");
const  router = express.Router();

const {agenciesadd , agenciesget, agenciesedit, agenciesdelete} = require("../controllers/agencieController");

//post data
router.post("/agencieinsert",agenciesadd);
router.get("/agenciesgetdata",agenciesget);
router.put("/agenciesEdit/:id",agenciesedit);
router.delete("/agenciedelete/:id",agenciesdelete);
module.exports = router;
const express = require("express");
const router = express.Router();
const { createProduct, getProduct, getAllProduct } = require("../controllers/productCtrl");

//post
router.post("/", createProduct);

//get
router.get("/", getAllProduct);
router.get("/:id", getProduct);

//put

//delete 

module.exports = router;
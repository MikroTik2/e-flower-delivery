const express = require("express");
const router = express.Router();
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct } = require("../controllers/productCtrl");

//post
router.post("/", createProduct);

//get
router.get("/", getAllProduct);
router.get("/:id", getProduct);

//put
router.put("/:id", updateProduct);

//delete 
router.delete("/:id", deleteProduct);

module.exports = router;
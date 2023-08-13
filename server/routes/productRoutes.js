const express = require("express");
const router = express.Router();
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct } = require("../controllers/productCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares")

//post
router.post("/", authMiddleware, isAdmin, createProduct);

//get
router.get("/", getAllProduct);
router.get("/:id", getProduct);

//put
router.put("/:id", authMiddleware, isAdmin, updateProduct);

//delete 
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
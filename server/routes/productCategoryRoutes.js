const express = require("express");
const router = express.Router();
const { createCategory, getCategory, getAllCategory, updateCategory, deleteCategory } = require("../controllers/productCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");

//post
router.post("/new-category" ,createCategory);

//get
router.get('/category-get/:id', getCategory);
router.get('/all-category', getAllCategory);

//put
router.put('/update/:id', updateCategory);

//delete
router.delete('/delete/:id', deleteCategory);

module.exports = router;
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const slugify = require("slugify");


//create a product
const createProduct = asyncHandler(async (req, res) => {
  try {

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    };

    const newProduct = await Product.create(req.body);
    res.json(newProduct);

  } catch (error) {
    throw new Error(error);
  };
}); 

//get a product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const findProduct = await Product.findById(id);
    res.json(findProduct);

  } catch (error) {
    throw new Error(error);
  };
});

//get all a product 
const getAllProduct = asyncHandler(async (req, res) => {
  try {

    const findAllProduct = await Product.find();
    res.json(findAllProduct);

  } catch (error) {
    throw new Error(error);
  };
});

//update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const update = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(update);

  } catch (error) {
    throw new Error(error);
  };
});

//delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);

  } catch (error) {
    throw new Error(error);
  };
});

module.exports = { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct };
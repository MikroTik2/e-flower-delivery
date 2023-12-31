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

    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    let query = Product.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    };

    //limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
        query = query.select("-__v");
    };

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.body.page) {
      const productCount = await Product.countDocuments();

      if (skip >= productCount) throw new Error("this page does not exists");
    };

    const product = await query;
    res.json(product);

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
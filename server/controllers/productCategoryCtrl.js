const PCategory = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");

//create a category
const createCategory = asyncHandler(async (req, res) => {
  try {

    const newCategory = await PCategory.create(req.body);
    res.json(newCategory);

  } catch (error) {
    throw new Error(error);
  };
});

//get a category
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {

    const getCategory = await PCategory.findById(id);
    res.json(getCategory);

  } catch (error) {
    throw new Error(error);
  };
});

//get all a category
const getAllCategory = asyncHandler(async (req, res) => {

  try {

    const getAllCategory = await PCategory.find();
    res.json(getAllCategory);

  } catch (error) {
    throw new Error(error);
  };
});

//update a category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {

    const update = await PCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.json(update);

  } catch (error) {

  };
});

//delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {

    const deleteCategory = await PCategory.findByIdAndDelete(id);
    res.json(deleteCategory);

  } catch (error) {

  };
});

module.exports = { createCategory, getCategory, getAllCategory, updateCategory, deleteCategory };
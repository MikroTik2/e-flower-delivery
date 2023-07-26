const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateToken } = require("../config/jwtToken");

// register a user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  };
});

//login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      email: findUser?.email,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error("Invalid credentials");
  };
});

// get all a user
const getAllUser = asyncHandler(async (req, res) => {
  try {

    const getAllFind = await User.find();
    res.json(getAllFind);

  } catch (error) {
    throw new Error(error);
  };
});

// get user id
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const findUser = await User.findById(id);
    res.json(findUser);
    
  } catch (error) {
    throw new Error(error);
  };
});

// update a password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);

  const user = await User.findById(_id);

  if (password) {
    user.password = password;

    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  };
});

// block a user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const block = await User.findByIdAndUpdate(id, {
      isBlocked: true
    }, { new: true });

    res.json(block);

  } catch (error) {
    throw new Error(error);
  };
});

// unblock a user
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const unBlock = await User.findByIdAndUpdate(id, {
      isBlocked: false
    }, { new: true });

    res.json(unBlock);

  } catch (error) {
    throw new Error(error);
  };
});

// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {

    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);

  } catch (error) {
    throw new Error(error);
  };
});

module.exports = { createUser, loginUser, getAllUser, getUser, deleteUser, blockUser, unBlockUser, updatePassword };
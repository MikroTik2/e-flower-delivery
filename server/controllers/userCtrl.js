const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");

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

    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(findUser.id, {
      refreshToken: refreshToken,
    }, { new: true });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findUser?._id,
      email: findUser?.email,
      role: findUser?.role,
      token: generateToken(findUser?._id),
    });

  } else {
    throw new Error("Invalid credentials");
  };
});

//login a admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== "admin") throw new Error("not authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(findAdmin.id, {
      refreshToken: refreshToken,
    }, { new: true });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?._id,
      email: findAdmin?.email,
      role: findAdmin?.role,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("invalid credentials");
  };
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookies");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" no refresh token present in db or not matched");

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {

    if (err || user.id !== decoded.id) {
      throw new Error("there is something wrong with refresh token");
    };

    const accessToken = generateToken(user?._id);
    res.json({ accessToken });

  });
});

//logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("no refresh token in cookies");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    return res.sendStatus(204);
  };

  await User.findOneAndUpdate({ refreshToken: refreshToken }, {
    refreshToken: "",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  return res.sendStatus(204);

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

//add to cart 
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {

    let products = [];

    const user = await User.findById(_id);

    const alreadyExistCart = await Cart.findOne({ orderby: user._id });

    if (alreadyExistCart) {
      alreadyExistCart.remove();
    };

    for (let i = 0; i < cart.length; i++) {
      let object = { };

      object.product = cart[i]._id;
      object.count = cart[i].count;

      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }

  } catch (error) {
    throw new Error(error);
  };

  let cartTotal = 0;

  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  };

  let newCart = await new Cart({
    products,
    cartTotal,
    orderby: user?._id,
  }).save();

  res.json(newCart);

});

// reset a password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error("token expired, please try again login");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();

  res.json(user);
});

//add to wishlist
const addToWoshlist = asyncHandler(async (req, res) => {
  const { prodId } = req.params;
  const { id } = req.params;


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

module.exports = { createUser, loginUser, addToWoshlist, loginAdmin, userCart, resetPassword, getAllUser, logout, getUser, handleRefreshToken, deleteUser, blockUser, unBlockUser, updatePassword };
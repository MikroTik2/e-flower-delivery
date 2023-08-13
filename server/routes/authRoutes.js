const express = require("express");
const router = express.Router();
const { createUser, loginUser, getCart, removeFromCart, clearCart, getWishlist, addToWishlist, getAllUser, addToCart, loginAdmin, logout, resetPassword, handleRefreshToken, getUser, deleteUser, blockUser, unBlockUser, updatePassword } = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");

//post
router.post("/register", createUser);
router.post("/login", loginUser);
router.post('/admin-login', loginAdmin);
router.post("/add-cart", authMiddleware, addToCart);
router.post("/wishlist", authMiddleware, addToWishlist);

//get
router.get('/all-user', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/get-cart', authMiddleware, getCart);
router.get('/get-wishlist/:id', getWishlist);
router.get('/:id', authMiddleware, isAdmin, getUser);

//put
router.put('/password', authMiddleware, updatePassword);
router.put('/clear-cart', authMiddleware, clearCart);
router.put('/remove-cart', authMiddleware, removeFromCart);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);
router.put('/reset-password/:token', resetPassword);

//delete
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
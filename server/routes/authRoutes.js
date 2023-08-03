const express = require("express");
const router = express.Router();
const { createUser, loginUser, getAllUser, addToWoshlist, userCart, loginAdmin, logout, resetPassword, handleRefreshToken, getUser, deleteUser, blockUser, unBlockUser, updatePassword } = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");

//post
router.post("/register", createUser);
router.post("/login", loginUser);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);

//get
router.get('/all-user', getAllUser);
router.get("/wishlist", authMiddleware, addToWoshlist);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getUser);

//put
router.put('/password', authMiddleware, updatePassword)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);
router.put('/reset-password/:token', resetPassword)

//delete
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
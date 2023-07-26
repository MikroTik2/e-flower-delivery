const express = require("express");
const router = express.Router();
const { createUser, loginUser, getAllUser, getUser, deleteUser, blockUser, unBlockUser, updatePassword } = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddlewares");

//post
router.post("/register", createUser);
router.post("/login", loginUser);

//get
router.get('/', getAllUser);
router.get('/:id', authMiddleware, isAdmin, getUser);

//put
router.put('/password', authMiddleware, updatePassword)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);

//delete
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
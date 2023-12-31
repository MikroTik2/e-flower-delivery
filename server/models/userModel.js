const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "user",
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },
  
  address: {
    type: String,
  },
  
  refreshToken: {
    type: String,
  },
  
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
let productCategorySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    img: {
      type: String,
      required: true,
    },
    
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('PCategory', productCategorySchema);
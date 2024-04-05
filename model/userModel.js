// Import the necessary module
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// Destructure Schema from mongoose
const { Schema } = mongoose;

// Create a new instance of the Schema object with your desired fields
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true // Trims whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true // Trims whitespace
  },
  password: {
    type: String,
    select:false,
    required: true
  },
  flatNumber: {
    type: String,
    required: true
  },
  wing: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['Tenant', 'Committee Member', 'Society Manager'], // Example user types
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});


// converting password into hash
userSchema.pre("save", async function () {
  if (!this.isModified('password')) {
      next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

// compairing password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//josn web token genrator
userSchema.methods.getJWTtoken =  function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECREATE, {
      expiresIn: process.env.JWT_EXPIRE
  })
}


// Create a model from the schema
const userModel = mongoose.model('User', userSchema);

// Export the model
module.exports = userModel;

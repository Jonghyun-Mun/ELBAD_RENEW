const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  // Common Schema
  user_type: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  password: {
    type: String
  },
  password2: {
    type: String
  },
  meeting_region: {
    type: String
  },
  cell_phone_number: {
    type: String
  },
  photo: {
    type: String
  },
  birthday: {
    type: String
  },
  verification_code: {
    type: Number
  },
  verified: {
    type: Boolean,
    default: false
  },
  // Only Advertiser Schema
  company_name: {
    type: String
  },
  company_introduction: {
    type: String
  },
  company_homepage: {
    type: String
  },
  company_type: {
    type: String
  },
  // Only Creator Schema
  creator_nickname: {
    type: String
  },
  creator_introduction: {
    type: String
  },
  product_delivery_address: {
    type: String
  },
  product_delivery_recipient: {
    type: String
  }
});

module.exports = User = mongoose.model("users", UserSchema);

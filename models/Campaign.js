const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  // Basic info
  campaign_title: {
    type: String,
    required: true
  },
  campaign_purpose: {
    type: String,
    required: true
  },
  campaign_type: {
    type: String,
    required: true
  },
  campaign_social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  campaign_brand_introduction: {
    type: String,
    required: true
  },
  // Product detailes
  product_name: {
    type: String,
    required: true
  },
  product_URL: {
    type: String,
    required: true
  },
  product_photo: {
    type: String,
    required: true
  },
  product_delivery: {
    type: Boolean,
    required: true
  },
  // Ad target & budget
  target: {
    gender: {
      type: String
    },
    ages: {
      type: String
    },
    countries: {
      type: String
    }
  },
  campaign_budget: {
    type: String,
    required: true
  }
});

module.exports = Campaign = mongoose.model("campaign", CampaignSchema);

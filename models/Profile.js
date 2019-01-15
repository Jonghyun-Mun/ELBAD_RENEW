const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },

  total_views: {
    type: String
  },
  subscribers: {
    type: String
  },
  age_group: {
    "age13-17": {
      type: Number
    },
    "age18-24": {
      type: Number
    },
    "age25-34": {
      type: Number
    },
    "age35-44": {
      type: Number
    },
    "age45-54": {
      type: Number
    },
    "age65-": {
      type: Number
    }
  },

  country: {
    "0": {
      type: String
    },
    "1": {
      type: String
    },
    "2": {
      type: String
    },
    "3": {
      type: String
    },
    "4": {
      type: String
    },
    "5": {
      type: String
    },
    "6": {
      type: String
    },
    "7": {
      type: String
    },
    "8": {
      type: String
    },
    "9": {
      type: String
    },
    other_countries: {
      type: String
    }
  },
  gender: {
    female: {
      type: Number
    },
    male: {
      type: Number
    }
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);

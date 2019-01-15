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

  youtube_channel_information: [
    {
      total_views: {
        type: String
      },
      subscribers: {
        type: String
      },
      age_groups: {
        type: [String]
      },
      country: {
        type: [String]
      },
      gender: {
        type: [String]
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);

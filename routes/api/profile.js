const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../Validation/profile");
const validateYoutubeChannelInput = require("../../Validation/youtube_channel");

// Load Profile Model
const Profile = require("../../models/Profile");

// Load User Model
const User = require("../../models/User");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   Get api/profile/getCreatorList
// @desc    Get all profiles
// @access  Public
router.get("/getCreatorList", (req, res) => {
  const errors = {};
  User.find(
    { user_type: "creator" },
    {
      _id: 1,
      user_type: 1,
      name: 1,
      email: 1,
      meeting_region: 1,
      cell_phone_number: 1,
      creator_nickname: 1,
      creator_introduction: 1,
      photo: 1,
      product_delivery_address: 1,
      product_delivery_recipient: 1,
      category: 1
    }
  ).then(users => {
    Profile.find()
      .then(profiles => {
        if (!profiles) {
          errors.noprofile = "There are no profiles";
          return res.status(404).json(errors);
        }
        if (!users) {
          errors.nouser = "there are no creators";
          return res.status(404).json(errors);
        }
        res.json({ profiles, users });
      })
      .catch(err => res.status(404).json({ users: "there is no users" }));
  });
});

// @route   post api/profile/search_by_nickname
// @desc    search creator by nickname
// @access  Public
router.post("/search_by_nickname", (req, res) => {
  const search_index = req.body.search_index;

  const errors = {};
  User.createIndexes({ creator_nickname: "text", category: "text" });
  User.find(
    { creator_nickname: { $regex: new RegExp(search_index) } },
    {
      _id: 1,
      user_type: 1,
      name: 1,
      email: 1,
      meeting_region: 1,
      cell_phone_number: 1,
      creator_nickname: 1,
      creator_introduction: 1,
      photo: 1,
      product_delivery_address: 1,
      product_delivery_recipient: 1,
      category: 1
    }
  ).then(users => {
    Profile.find()
      .then(profiles => {
        if (search_index === "") {
          errors.nonickname = "There are no nickname";
          return res.status(404).json(errors);
        }
        if (!profiles) {
          errors.noprofile = "There are no profiles";
          return res.status(404).json(errors);
        }
        if (!users) {
          errors.nouser = "there are no creators";
          return res.status(404).json(errors);
        }
        res.json({ profiles, users });
      })
      .catch(err => res.status(404).json({ users: "there is no users" }));
  });
});

// @route   post api/profile/search_by_category
// @desc    search creator by category
// @access  Public
router.post("/search_by_category", (req, res) => {
  const search_index = req.body.search_index;

  const errors = {};
  User.createIndexes({ creator_nickname: "text", category: "text" });
  User.find(
    { category: { $regex: new RegExp(search_index) } },
    {
      _id: 1,
      user_type: 1,
      name: 1,
      email: 1,
      meeting_region: 1,
      cell_phone_number: 1,
      creator_nickname: 1,
      creator_introduction: 1,
      photo: 1,
      product_delivery_address: 1,
      product_delivery_recipient: 1,
      category: 1
    }
  ).then(users => {
    Profile.find()
      .then(profiles => {
        if (search_index === "") {
          errors.nocategory = "There are no categories";
          return res.status(404).json(errors);
        }
        if (!profiles) {
          errors.noprofile = "There are no profiles";
          return res.status(404).json(errors);
        }
        if (!users) {
          errors.nouser = "there are no creators";
          return res.status(404).json(errors);
        }
        res.json({ profiles, users });
      })
      .catch(err => res.status(404).json({ users: "there is no users" }));
  });
});

// @route   Get api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   Get api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// @route   POST api/profile/youtube_profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/youtube_profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.total_views) profileFields.total_views = req.body.total_views;
    if (req.body.subscribers) profileFields.subscribers = req.body.subscribers;
    if (req.body.age_group) profileFields.age_group = req.body.age_group;
    if (req.body.country) profileFields.country = req.body.country;
    if (req.body.gender) profileFields.gender = req.body.gender;

    /*
    // Skills - Spilt into array
    if (typeof req.body.age_group !== "undefined") {
      profileFields.age_group = req.body.age_group.split(",");
    }
    if (typeof req.body.country !== "undefined") {
      profileFields.country = req.body.country.split(",");
    }
    if (typeof req.body.gender !== "undefined") {
      profileFields.gender = req.body.gender.split(",");
    }
    */

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route POST api/profile/youtube_channel
// @desc Add youtubeChannelInformation from creator
// @access Private
router.post(
  "/youtube_channel",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateYoutubeChannelInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOneAndUpdate({ user: req.user.id }).then(profile => {
      const newYoutube = {
        total_views: req.body.total_views,
        subscribers: req.body.subscribers,
        age_group: req.body.age_group,
        country: req.body.country,
        gender: req.body.gender
      };

      // Add to youtube array
      profile.youtube_channel_information.unshift(newYoutube);
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/youtube_channel/:youtube_id
// @desc    Delete youtube_info from profile
// @access  Private
router.delete(
  "/youtube_channel/:youtube_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.youtube_channel_information
          .map(item => item.id)
          .indexOf(req.params.youtube_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

// 크리에이터 리스트
// @route  GET api/profile/get_creator_list
// @desc   Return Creator List
// @access Public
router.get("/get_creator_list", (req, res) => {
  //  Profile.findOne({ user: req.user.id }).then(profile =>
  User.findOne({ user_type: "creator" }).then(user => {
    res.json({
      email: req.user.email,
      name: req.user.name,
      meeting_region: req.user.meeting_region,
      cell_phone_number: req.user.cell_phone_number,

      creator_nickname: req.user.creator_nickname,
      photo: req.user.photo,
      creator_introduction: req.user.creator_introduction,
      product_delivery_address: req.user.product_delivery_address,
      product_delivery_recipient: req.user.product_delivery_recipient
      /*
        total_views: req.profile.total_views,
        subscribers: req.profile.subscribers,
        age_group: req.profile.age_group,
        country: req.profile.country,
        gender: req.profile.gender */
    });
  });
});

// @route Get/api/profile/pagination_creator
// @desc get creator info. through pagination
// @access Public

router.get("/pagination_creator", (req, res) => {
  const page = Math.max(1, req.body.page);
  const limit = 2;

  User.find({ user_type: "creator" }).count({}, function(err, count) {
    if (err) return res.json({ sucess: false, message: err });

    const skip = (page - 1) * limit;
    const maxPage = Math.ceil(count / limit);

    //  Profile.find({ user: req.user.id }).then(profile =>
    User.find({ user_type: "creator" })
      .skip(skip)
      .limit(limit)
      .exec(function(err, users) {
        if (err) {
          return res.json({ success: false });
        } else {
          res.json({
            users: users,
            page: page,
            maxPage: maxPage,
            email: users.email,
            name: users.name,
            meeting_region: users.meeting_region,
            cell_phone_number: users.cell_phone_number,

            creator_nickname: users.creator_nickname,
            photo: users.photo,
            creator_introduction: users.creator_introduction,
            product_delivery_address: users.product_delivery_address,
            product_delivery_recipient: users.product_delivery_recipient
            /*
        total_views: req.profile.total_views,
        subscribers: req.profile.subscribers,
        age_group: req.profile.age_group,
        country: req.profile.country,
        gender: req.profile.gender */
          });
        }
      });
  });
});

module.exports = router;

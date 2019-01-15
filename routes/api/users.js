const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../Validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route  GET api/Users/test
// @desc   Tests user route
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works" });
});

// @route POST api/users/register
// @desc Register users
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "이미 등록된 이메일입니다";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        // Common
        user_type: req.body.user_type,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2,
        meeting_region: req.body.meeting_region,
        cell_phone_number: req.body.cell_phone_number,
        // Advertiser
        company_name: req.body.company_name,
        company_introduction: req.body.company_introduction,
        company_homepage: req.body.company_homepage,
        company_photo: req.body.company_photo,
        company_type: req.body.company_type,
        // Creator
        creator_nickname: req.body.creator_nickname,
        creator_introduction: req.body.creator_introduction,
        creator_photo: req.body.creator_photo,
        product_delivery_address: req.body.product_delivery_address,
        product_delivery_recipient: req.body.product_delivery_recipient
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  POST api/users/login
// @desc   Login User / Returning JWT token
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email: email }).then(user => {
    //check for user
    if (!user) {
      errors.email = "등록된 유저가 아닙니다";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        const payload = {
          id: user.id,
          name: user.name,
          user_type: user.user_type
        }; // Create JWT payload
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "비밀번호가 일치하지 않습니다";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      user_type: req.user.user_type,
      total_views: req.user.total_views,
      subscribers: req.user.subscribers,
      age_group: req.user.age_group,
      country: req.user.country,
      gender: req.user.gender
    });
  }
);
// @route  GET api/users/get_object_id
// @desc   Return current user id
// @access Private
router.get(
  "/get_object_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id
    });
  }
);

/* 크리에이터 리스트 캠페인 리스트 개발
// @route  GET api/users/get_creator_list
// @desc   Return Creator List
// @access Public
router.get("/get_creator_list", (req, res) => {
  User.findOne({ user_type: "creator" }).then(user => {
    res.json({
      creator_nickname: req.user.creator_nickname,
      creator_photo: req.user.creator_photo
    });
  });
});

// @route  GET api/users/get_advertiser_ist
// @desc   Return Advertiser List
// @access Public
router.get();
*/
module.exports = router;

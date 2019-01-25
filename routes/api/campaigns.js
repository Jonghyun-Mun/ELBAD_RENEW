const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Campaign model
const Campaign = require("../../models/Campaign");

// USer model
const User = require("../../models/User");

// Load Validation
const validateCampaignInput = require("../../Validation/campaign");

// @route   GET api/campaigns/test
// @desc    Tests campaigns route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Campaigns Works" }));

// @route   GET api/campaigns
// @desc    Get campaigns
// @access  Public
router.get("/", (req, res) => {
  Campaign.find()
    .sort({ date: -1 })
    .then(campaigns => res.json(campaigns))
    .catch(err => res.status(404).json({ nocampaignsfound: "No posts found" }));
});

// @route   POST api/campaigns
// @desc    Create campaigns
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("여기서 걸리니?");

    const { errors, isValid } = validateCampaignInput(req.body);
    console.log("여기서 걸리니222?");

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newCampaign = new Campaign({
      // new campaign 에서 입력받을 정보
      campaign_title: req.body.campaign_title,
      campaign_purpose: req.body.campaign_purpose,
      campaign_type: req.body.campaign_type,
      youtube: req.body.youtube,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      campaign_brand_introduction: req.body.campaign_brand_introduction,
      product_name: req.body.product_name,
      product_URL: req.body.product_URL,
      product_photo: req.body.product_photo,
      product_delivery: req.body.product_delivery,
      gender: req.body.gender,
      ages: req.body.ages,
      countries: req.body.countries,
      campaign_budget: req.body.campaign_budget,
      // user 에서 불러올 정보
      name: req.user.name,
      user: req.user.id,
      user_type: req.user.user_type,
      email: req.user.email,
      cell_phone_number: req.user.cell_phone_number
    });

    newCampaign.save().then(campaign => res.json(campaign));
  }
);

module.exports = router;

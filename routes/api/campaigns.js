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
    const { errors, isValid } = validateCampaignInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newCampaign = new Campaign({
      // user 정보에서는 어떤 정보를 불러와야하나 생각생각생각생각 신한카드
      text: req.body.text,
      name: req.user.name,
      user: req.user.id,
      email: req.user.email,
      cell_phone_number: req.user.cell_phone_number
    });

    newCampaign.save().then(campaign => res.json(campaign));
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const multer = require("multer");
const nodemailer = require("nodemailer");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage });
/*
// Image upload setting
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/gif" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일은 jpg, jpeg, png 파일만 가능합니다."), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
*/

// Load Input Validation
const validateRegisterInput = require("../../Validation/register");
const validateLoginInput = require("../../validation/login");
const validateReviseInput = require("../../Validation/revise");

// Load User model
const User = require("../../models/User");

// Load Profile model
const Profile = require("../../models/Profile");

// @route GET api/users/getPhoto/:email
// @desc saving photo data name
// @access Public
router.get("/getPhoto/:name", (req, res) => {
  res.sendFile("C:/Users/pc/Desktop/CAN/uploads/" + req.params.name);
});

// @route  GET api/Users/test
// @desc   Tests user route
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works" });
});

// IMAGE UPLOAD TEST

// @route POST api/users/register
// @desc Register users
// @access Public
router.post("/register", upload.single("photo"), (req, res) => {
  console.log(req.file);
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    console.log("밸리데이션에러");
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
        meeting_region: req.body.meeting_region,
        cell_phone_number: req.body.cell_phone_number,
        photo: req.file.filename,
        birthday: req.body.birthday,
        // Advertiser
        company_name: req.body.company_name,
        company_introduction: req.body.company_introduction,
        company_homepage: req.body.company_homepage,
        company_type: req.body.company_type,
        // Creator
        creator_nickname: req.body.creator_nickname,
        creator_introduction: req.body.creator_introduction,
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
      meeting_region: req.user.meeting_region,
      cell_phone_number: req.user.cell_phone_number,
      company_name: req.user.company_name,
      company_introduction: req.user.company_introduction,
      company_homepage: req.user.company_homepage,
      photo: req.user.photo,
      company_type: req.user.company_type,
      creator_nickname: req.user.creator_nickname,
      creator_introduction: req.user.creator_introduction,
      product_delivery_address: req.user.product_delivery_address,
      product_delivery_recipient: req.user.product_delivery_recipient
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

// @route Put api/users/edit_user
// @desc Revise users data
// @access Private
router.put(
  "/edit_user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateReviseInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const reviseFields = {};
    // Common
    reviseFields.user = req.user.id;
    if (req.body.name) reviseFields.name = req.body.name;
    if (req.body.password) reviseFields.password = req.body.password;

    reviseFields.meeting_region = req.body.meeting_region;
    if (req.body.cell_phone_number)
      reviseFields.cell_phone_number = req.body.cell_phone_number;
    if (req.body.photo) reviseFields.photo = req.body.photo;
    if (req.body.birthday) reviseFields.birthday = req.body.birthday;
    // Advertiser
    if (req.body.company_name)
      reviseFields.company_name = req.body.company_name;
    if (req.body.company_introduction)
      reviseFields.company_introduction = req.body.company_introduction;
    if (req.body.company_homepage)
      reviseFields.company_homepage = req.body.company_homepage;
    if (req.body.company_type)
      reviseFields.company_type = req.body.company_type;
    // Creator
    if (req.body.creator_nickname)
      reviseFields.creator_nickname = req.body.creator_nickname;
    if (req.body.creator_introduction)
      reviseFields.creator_introduction = req.body.creator_introduction;

    if (req.body.product_delivery_address)
      reviseFields.product_delivery_address = req.body.product_delivery_address;
    if (req.body.product_delivery_recipient)
      reviseFields.product_delivery_recipient =
        req.body.product_delivery_recipient;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(reviseFields.password, salt, (err, hash) => {
        if (err) throw err;
        reviseFields.password = hash;
        console.log(reviseFields.password);
        //reviseFields
        //  .save()
        //  .then(user => res.json(user))
        //  .catch(err => console.log(err));
      });
    });
    // Update

    User.findOne({ _id: req.user.id }).then(user => {
      if (user) {
        User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: reviseFields },
          { new: true }
        ).then(user => res.json(user));
      }
    });
  }
);

// @router Post api/users/images

router.post("/image", function(req, res, next) {
  upload(req, res).then(
    function(file) {
      res.json(file);
    },
    function(err) {
      res.send(500, err);
    }
  );
});

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
/*
// email-verification - one way 
console.log("bb");
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mjh0458@gmail.com",
    pass: "384758a9047"
  }
});
console.log("aaa");
var rand, mailOptions, host, link;

router.get("/", function(req, res) {
  res.sendfile("C:/Users/pc/Desktop/CAN/routes/index.html");
});
router.get("/send", function(req, res) {
  rand = Math.floor(Math.random() * 100 + 54);
  host = req.get("host");
  link = "http://" + req.get("host") + "/verify?id=" + rand;
  mailOptions = {
    to: "mjh0458@gmail.com",
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
});

router.get("/verify", function(req, res) {
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + host) {
    console.log("Domain is matched. Information is from Authentic email");
    if (req.query.id == rand) {
      console.log("email is verified");
      res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
    } else {
      console.log("email is not verified");
      res.end("<h1>Bad Request</h1>");
    }
  } else {
    res.end("<h1>Request is from unknown source");
  }
});
*/
module.exports = router;

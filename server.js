const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// email- verification
const nodemailer = require("nodemailer");
/*
const nev = require("email-verification")(mongoose);
require("./config/email-verification")(nev);
require("./config/passport")(passport, nev);
*/

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const campaigns = require("./routes/api/campaigns");

const app = express();

// Server - Client
app.use(cors());

// File Upload
app.use("./routes/api/uploads", express.static("uploads"));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/campaigns", campaigns);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));

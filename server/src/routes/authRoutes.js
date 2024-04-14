const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { preRegister } = require("../middlewares/authMiddleware");
const { parseTree } = require("../services/service_tree_gpt_parse");
const DEFAULT_TREE = require("../assets/phys.json");
require("dotenv").config();

const router = express.Router();

// Register route
router.post("/register", preRegister, async (req, res) => {
  // Registration logic
  const { username, email } = req.body.user;
  try {
    const user = await new User({
      username: username,
      email: email,
      password: req.hashedPassword,
    });
    await user.save();
    const userId = user._id;

    parseTree(DEFAULT_TREE, userId);

    const actoken = await jwt.sign({ userId: userId }, process.env.KEY, {
      expiresIn: process.env.JWT_EXPIRE_DATE,
    });

    res
      .status(201)
      .json({ actoken: actoken, message: "Successful Registration" });
  } catch (err) {
    res.sendStatus(500);
    console.log(err.message);
  }
});

// Login route
router.get("/login/:email/:password", async (req, res) => {
  // Login logic
  try {
    const { email, password } = req.params;

    if (!(await User.findOne({ email: email })))
      return res.status(401).json({ message: "Account doesn't exist" });

    const user = await User.findOne({ email: email });
    const hashedPassword = user.password;

    if (await bcrypt.compare(password, hashedPassword)) {
      const actoken = await jwt.sign({ userId: user._id }, process.env.KEY, {
        expiresIn: process.env.JWT_EXPIRE_DATE,
      });

      res.status(200).json({ actoken: actoken, message: "Succesful LogIn" });
    } else return res.status(403).json({ message: "Incorrect Password" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something Went Wrong in the Server" });
  }
});

module.exports = router;

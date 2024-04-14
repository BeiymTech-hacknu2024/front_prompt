const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

// middleware to register
async function preRegister(req, res, next) {
  const { password, email } = req.body.user;

  if (await User.exists({ email: email }))
    return res.status(409).json({ message: "User alredy exists" });
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    req.hashedPassword = hashedPassword;
    next();
  } catch (err) {
    res.sendStatus(500);
    console.log(err.message);
    next();
  }
}

async function getUser(req, res, next) {
  try {
    const actoken = await req.headers.authorization.split(" ")[1];
    if (!actoken)
      return res.status(401).json({ message: "Couldn't Authorize" });
    try {
      const token = await jwt.verify(actoken, process.env.KEY);

      // const iatTimestamp = token.iat;
      // const expTimestamp = token.exp;

      // const iatDate = new Date(iatTimestamp * 1000);
      // const expDate = new Date(expTimestamp * 1000);

      // console.log("Issued At:", iatDate.toISOString());
      // console.log("Expiration:", expDate.toISOString());

      const userId = token.userId;
      req.userId = userId;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "The Session Time is Expired" });
      } else {
        return res
          .status(401)
          .json({ message: `Internal Server Error: \n ${err}` });
      }
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Couldn't Authorize" });
    console.log(err.meassage);
  }
}

module.exports = { getUser, preRegister };

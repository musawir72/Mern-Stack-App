const express = require("express");
const auth = require("../middleware/auth");
const User = require("../model/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

//@ route api/auth

router.get("/", auth, (req, res) => res.send("Auth Api"));

router.post(
  "/",

  [
    check("email", "Please Include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    try {
      const paylod = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        paylod,
        config.get("jwtSecrete"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

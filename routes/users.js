const express = require("express");
const Route = express.Router();
// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require("express-validator");

const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//@ route api/users

Route.post(
  "/",

  [
    check("name", "Name is Required")
      .not()
      .isEmpty(),
    check("email", "Please Include a valid email").isEmail(),
    check("password", "Password must be at least 5 chars long").isLength({
      min: 5
    })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "user already exist" }] });
    } else {
      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    try {
      await user.save();

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

module.exports = Route;

const express = require("express");
const Route = express.Router();
const auth = require("../middleware/auth");
const Profile = require("../model/Profile");
const User = require("../model/User");
const { check, validationResult } = require("express-validator");

//get logged in user profile
Route.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for that user" });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.msg);
    res.status(400).send("Server Error");
  }
});

//create and update profile
Route.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array });
    }
    console.log(req.body);

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      facebook,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => {
        return skill.trim();
      });
    }
    profileFields.social = {};

    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error.msg);
      res.status(500).send("Server Error");
    }
    res.send("hello");
  }
);

//get all profiles
Route.get("/", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name"]);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Server Error");
  }
});

//get profiles BY user id
Route.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name"]);
    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for this user"
      });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({
        msg: "Profile not found"
      });
    }
    res.status(400).send("Server Error");
  }
});

//get profiles BY user id
Route.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: this.req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({
      msg: "User along with profile are deleted"
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Server Error");
  }
});

//add profile experience
Route.put(
  "/experience",
  [
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
    ],
    auth
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(400).send("Server Error");
    }
  }
);

//delete profile experience
Route.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const experience = profile.experience;
    const index = experience.findIndex(
      exp => exp.id.toString() === req.params.exp_id
    );

    experience.splice(index, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.send("Server Error");
  }
});

//add profile education
Route.put(
  "/education",
  [
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ],
    auth
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(400).send("Server Error");
    }
  }
);

//delete profile experience
Route.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const education = profile.education;
    const index = education.findIndex(
      edu => edu.id.toString === req.params.edu_id
    );

    education.splice(index, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.send("Server Error");
  }
});

module.exports = Route;

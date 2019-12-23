const express = require("express");
const { check, validationResult } = require("express-validator");
const Post = require("../model/Posts");
const User = require("../model/User");
const auth = require("../middleware/auth");
const Route = express.Router();

//@ route api/posts

//add post
Route.post(
  "/",
  [
    auth,
    [
      check("text", "Text is requires")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    console.log(req.user.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.send("Server Error");
    }
  }
);

//get all posts
Route.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.send("Server Error");
  }
});

//get posts by id
Route.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("No Post found");
    }
    res.json(post);
  } catch (error) {
    if (error.kind === ObjectId) {
      return res.status(404).json("No Post found");
    }
    console.log(error.message);
    res.send("Server Error");
  }
});

//delete post
Route.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json("No Post found");
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(404).json("User not authorized");
    }

    await post.remove();
    res.json("Post deleted");
  } catch (error) {
    if (error.kind === ObjectId) {
      return res.status(404).json("No Post found");
    }
    console.log(error.message);
    res.send("Server Error");
  }
});

//post like by user
Route.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(404).json("Post already liked");
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.send("Server Error");
  }
});

//post unlike by user
Route.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ==
      0
    ) {
      return res.status(404).json("Post has not been liked");
    }

    const index = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    post.likes.splice(index, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.send("Server Error");
  }
});

//add comment
Route.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is requires")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    console.log(req.user.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      res.send("Server Error");
    }
  }
);

//delete comment
Route.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json("Post not found");
    }

    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "commemt does not exist" });
    }
    console.log(comment.user);
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "un authorized user" });
    }

    const index = post.comments.findIndex(
      commemt => commemt.user.toString === req.user.id
    );

    post.comments.splice(index, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    res.send("Server Error");
  }
});

module.exports = Route;

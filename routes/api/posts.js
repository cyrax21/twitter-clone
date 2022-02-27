const express = require("express");
const router = express.Router();
const Post = require("../../models/post");
const { isLoggedIn } = require("../../middleware");
const User = require("../../models/user");

// To get all the posts
router.get("/api/post", isLoggedIn, async (req, res) => {
	const filter = req.query;
	const results = await Post.find(filter)
		.populate("postedBy")
		.populate("replyTo");

	posts = await User.populate(results, { path: "replyTo.postedBy" });

	res.json(posts);
});

// To Add new posts to the database
router.post("/api/post", isLoggedIn, async (req, res) => {
	let post = {
		content: req.body.content,
		postedBy: req.user,
	};

	if (req.body.replyTo) {
		post = {
			...post,
			replyTo: req.body.replyTo,
		};
	}

	const newPost = await Post.create(post);

	res.json(newPost);
});

// To get the post details in the modal
router.get("/api/posts/:id", async (req, res) => {
	const post = await Post.findById(req.params.id).populate("postedBy");

	res.status(200).json(post);
});

router.patch("/api/posts/:id/like", isLoggedIn, async (req, res) => {
	const postId = req.params.id;
	const userId = req.user._id;

	// checking whether the user has liked that post or not
	const isLiked = req.user.likes && req.user.likes.includes(postId);

	// pull is to remove the like if present
	// addToSet is used to adds a value to an array
	const option = isLiked ? "$pull" : "$addToSet";

	req.user = await User.findByIdAndUpdate(
		userId,
		{ [option]: { likes: postId } },
		{ new: true }
	);
	const post = await Post.findByIdAndUpdate(
		postId,
		{ [option]: { likes: userId } },
		{ new: true }
	);

	res.status(200).json(post);
});

module.exports = router;

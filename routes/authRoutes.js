const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// To get the signup form
router.get("/register", (req, res) => {
	res.render("auth/signup", { message: req.flash("error") });
});

// Register the user
router.post("/register", async (req, res) => {
	try {
		const user = {
			firstName: req.body.firstname,
			lastName: req.body.lastname,
			email: req.body.email,
			username: req.body.username,
		};

		const newUser = await User.register(user, req.body.password);

		req.flash("sucess", "Registered Succesfully PLease Login to Continue !");
		res.redirect("/login");
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/register");
	}
});

router.get("/login", (req, res) => {
	res.render("auth/login");
});

// login the user into the session
router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: true,
	}),
	function (req, res) {
		res.redirect("/");
	}
);

// Logout the user
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});

module.exports = router;

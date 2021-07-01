const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/users");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.send(user);
});

router.post("/", async (req, res) => {
	//& express validation
	const { error } = validateUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//& checking if the email already exists
	const userTemp = await User.findOne({ email: req.body.email });
	if (userTemp) return res.status(400).send("the user already exists");

	const user = new User(_.pick(req.body, ["name", "email", "password"]));

	//& hasing the passwords
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	//& creating jwt
	const token = user.generateAuthToken();

	res.header("X-auth-token", token).send(
		_.pick(user, ["_id", "name", "email"])
	);
});

module.exports = router;

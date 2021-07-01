const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/users");

router.post("/", async (req, res) => {
	//& express validation
	const { error } = validateAuth(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//& checking if the email already exists
	const userTemp = await User.findOne({ email: req.body.email });
	if (!userTemp) return res.status(400).send("invalid email or password");

	//& checking the passwords
	const validPassword = await bcrypt.compare(
		req.body.password,
		userTemp.password
	);
	if (!validPassword) return res.status(400).send("Invalid email or password");

	//& creating jwt
	const token = userTemp.generateAuthToken();
	res.send(token);
});

const validateAuth = (auth) => {
	const schema = Joi.object({
		email: Joi.string().required().min(5).max(255).email(),
		password: Joi.string().required().min(5).max(255),
	});

	return schema.validate(auth);
};

module.exports = router;

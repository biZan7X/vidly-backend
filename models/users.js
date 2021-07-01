const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		maxlength: 50,
		required: true,
	},
	email: {
		type: String,
		minlength: 5,
		maxlength: 255,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minlength: 5,
		maxlength: 255,
		required: true,
	},
});

userSchema.methods.generateAuthToken = function () {
	return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey")); //^ payload , private key => param
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
	const schema = Joi.object({
		name: Joi.string().required().min(3).max(12),
		email: Joi.string().required().min(5).max(255).email(),
		password: Joi.string().required().min(5).max(255),
	});

	return schema.validate(user);
};

module.exports.User = User;
module.exports.validateUser = validateUser;

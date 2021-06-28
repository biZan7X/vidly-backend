const mongoose = require("mongoose");
const Joi = require("joi");

//& schema for documents
const genreSchema = new mongoose.Schema({
	name: { type: String, required: true, minlength: 5, maxlength: 25 },
});

//& class for the documents
const Genre = mongoose.model("Genres", genreSchema);

const genreValidation = (genre) => {
	const schema = Joi.object({
		name: Joi.string().min(5).max(25).required(),
	});

	return schema.validate(genre);
};

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = genreValidation;

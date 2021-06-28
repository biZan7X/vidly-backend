const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

//* creating model
const Movie = mongoose.model(
	"Movies",
	new mongoose.Schema({
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 5,
			maxlength: 255,
		},
		genre: [genreSchema],
		numberInStock: {
			type: Number,
			required: true,
			min: 5,
			max: 500,
		},
		dailyRentalRate: {
			type: Number,
			required: true,
			min: 5,
			max: 500,
		},
	})
);

//* express validation
const validateMovie = (movie) => {
	const schema = Joi.object({
		title: Joi.string().required().min(5).max(255),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number().min(5).max(500),
		dailyRentalRate: Joi.number().min(5).max(501),
	});

	return schema.validate(movie);
};

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;

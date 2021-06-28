const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
	"Rental",
	new mongoose.Schema({
		//~ custom schema, since we dont want all the properties of the customer to be stored
		//~ hybrid solution : will store the id
		customer: {
			type: new mongoose.Schema({
				name: {
					type: String,
					required: true,
					minlength: 5,
					maxlength: 50,
				},
				isGold: {
					type: Boolean,
					default: false,
				},
				phone: {
					type: String,
					required: true,
					minlength: 5,
					maxlength: 50,
				},
			}),
			required: true,
		},
		movie: {
			type: new mongoose.Schema({
				title: {
					type: String,
					required: true,
					trim: true,
					minlength: 5,
					maxlength: 255,
				},
				dailyRentalRate: {
					type: Number,
					required: true,
					min: 0,
					max: 501,
				},
			}),
			required: true,
		},
		dateOut: {
			type: Date,
			required: true,
			default: Date.now,
		},
		dateReturned: {
			type: Date,
		},
		rentalFee: {
			type: Number,
			min: 0,
		},
	})
);

const validateRental = (rental) => {
	const schema = Joi.object({
		customerId: Joi.string().required(),
		movieId: Joi.string().required(),
	});

	return schema.validate(rental);
};

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;

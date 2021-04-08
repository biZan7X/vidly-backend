const mongoose = require("mongoose");
const Joi = require("joi");

//& schema for documents
const customerSchema = new mongoose.Schema({
	isGold: { type: Boolean, default: false },
	name: { type: String, minLength: 3, maxlength: 30, required: true },
	phone: { type: String, required: true, minLength: 3, maxlength: 30 },
});

//& class for documents
const Customers = mongoose.model("Customers", customerSchema);

const customerValidation = (customer) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(30).required(),
		isGold: Joi.boolean(),
		phone: Joi.string().min(3).max(30).required(),
	});

	return schema.validate(customer);
};

module.exports.Customers = Customers;
module.exports.validate = customerValidation;

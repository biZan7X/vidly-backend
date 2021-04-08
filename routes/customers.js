const express = require("express");
const router = express.Router();
const { Customers, validate } = require("../models/customers");

//* Get routes -------------------------------------------------------------------------------------
//& get all the customers
router.get("/", async (req, res) => {
	const customers = await Customers.find().sort({ name: 1 });
	res.send(customers);
});

//& get the specific customer
router.get("/:id", async (req, res) => {
	const customer = await Customers.findById(req.params.id);
	if (!customer) return res.status(404).send("the customer was not found");

	res.send(customer);
});

//* post routes--------------------------------------------------------------------------------------
router.post("/", async (req, res) => {
	//validation
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//creation
	const customer = new Customers({
		isGold: req.body.isGold,
		name: req.body.name,
		phone: req.body.phone,
	});

	//saving
	const result = await customer.save();
	res.send(result);
});

//*put route-----------------------------------------------------------------------------------------
router.put("/:id", async (req, res) => {
	//validation
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customers.findByIdAndUpdate(
		req.params.id,
		{
			isGold: req.body.isGold,
			name: req.body.name,
			phone: req.body.phone,
		},
		{ new: true }
	);

	if (!customer) return res.status(404).send("the customer was found");

	res.send(customer);
});

//* delete route--------------------------------------------------------------------------------------

router.delete("/:id", async (req, res) => {
	// finding the customer
	const customer = await Customers.findByIdAndDelete(req.params.id);

	res.send(customer);
});

//* validation----------------------------------------------------------------------------------------

module.exports = router;

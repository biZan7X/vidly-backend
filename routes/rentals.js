const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Rental, validateRental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customers } = require("../models/customers");
const Fawn = require("fawn");

Fawn.init(mongoose);

//* GET ROUTES
router.get("/", async (req, res) => {
	const rentals = await Rental.find();
	res.send(rentals);
});

router.get("/:id", async (req, res) => {
	const rentals = await Rental.findById(req.params.id);
	if (!rentals)
		return res
			.status(404)
			.send("the rental you are looking for is not found");

	res.send(rentals);
});

//* POST ROUTES
router.post("/", async (req, res) => {
	//& express validation : req
	const { error } = validateRental(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//& extracting the movie and the genre for the rental
	const movie = await Movie.findById(req.body.movieId);
	const customer = await Customers.findById(req.body.customerId);

	if (!movie || !customer)
		return res
			.status(404)
			.send("the movie or customer you are looking for is not found");

	if (movie.numberInStock === 0)
		return res.status(400).send("Movie not in stock.");

	//& creating the rental
	const rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			isGold: customer.isGold,
			phone: customer.phone,
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
	});

	//& performing transaction
	try {
		new Fawn.Task()
			.save("rentals", rental)
			.update(
				"movies",
				{ _id: movie._id },
				{
					$inc: { numberInStock: -1 },
				}
			)
			.run();

		res.send(rental);
	} catch (ex) {
		res.status(500).send("something went wrong");
	}
});

module.exports = router;

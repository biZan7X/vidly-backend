const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genres");
const { Movie, validateMovie } = require("../models/movies");

//* Get routes -------------------------------------------------------------------------------------

//& get all the movie
router.get("/", async (req, res) => {
	const movies = await Movie.find();
	res.send(movies);
});

//& get a specific movie
router.get("/:id", async (req, res) => {
	const movies = await Movie.findById(req.params.id);
	if (!movies) return res.status(404).send("the movie was not found");

	res.send(movies);
});

//* post routes--------------------------------------------------------------------------------------
router.post("/", async (req, res) => {
	//~validation
	const { error } = validateMovie(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//~ getting the genre
	const genre = await Genre.findById(req.body.genreId);
	if (!genre) res.status(404).send("no such genre found");

	//~ creating the movie
	const movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});

	const result = await movie.save();
	res.send(result);
});

//*put route-----------------------------------------------------------------------------------------

router.put("/:id", async (req, res) => {
	//~ validation
	const { error } = validateMovie(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//~ getting the genre
	const genre = await Genre.findById(req.body.genreId);
	if (!genre) res.status(404).send("no such genre found");

	//~ finding and updating
	const movie = await Movie.findByIdAndUpdate(req.params.id, {
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentaleRate: req.body.dailyRentaleRate,
		new: true,
	});

	if (!movie) return res.status(404).send("the movie was not found");

	res.send(movie);
});

//* delete route--------------------------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
	const result = await Movie.findByIdAndDelete(req.params.id);
	if (!result) return res.status(404).send("the movie was not found");

	res.send(result);
});

module.exports = router;

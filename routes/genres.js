const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genres");

//* Get routes -------------------------------------------------------------------------------------

//& get all the genres
router.get("/", async (req, res) => {
	const genres = await Genre.find();
	res.send(genres);
});

//& get a specific genre
router.get("/:id", async (req, res) => {
	// finding the genre
	const genre = await Genre.find({ _id: req.params.id });
	if (!genre) return res.status(404).send("the genre was not found");

	res.send(genre);
});

//* post routes--------------------------------------------------------------------------------------
router.post("/", async (req, res) => {
	//validation
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// creation
	const genre = new Genre({
		name: req.body.name,
	});

	// saving
	const result = await genre.save();
	res.send(result);
});

//*put route-----------------------------------------------------------------------------------------
router.put("/:id", async (req, res) => {
	//validation
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// finding the genre and updating
	const genre = await Genre.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
		},
		{ new: true }
	);
	if (!genre) return res.status(404).send("the genre was not found");

	res.send(genre);
});

//* delete route--------------------------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
	// finding the genre
	const genre = await Genre.findByIdAndDelete(req.params.id);

	res.send(genre);
});

module.exports = router;

const Joi = require("joi");
const express = require("express");
const router = express.Router();

const genres = [
	{ id: 1, name: "Action" },
	{ id: 2, name: "Comedy" },
	{ id: 3, name: "Sci-fi" },
];

//* Get routes -------------------------------------------------------------------------------------

//& get all the genres
router.get("/", (req, res) => {
	res.send(genres);
});

//& get a specific genre
router.get("/:id", (req, res) => {
	// finding the genre
	const genre = genres.find((g) => g.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send("the genre was not found");

	res.send(genre);
});

//* post routes--------------------------------------------------------------------------------------
router.post("/", (req, res) => {
	//validation
	const { error } = genreValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = {
		id: genres.length + 1,
		name: req.body.name,
	};

	genres.push(genre);
	res.send(genre);
});

//*put route-----------------------------------------------------------------------------------------
router.put("/:id", (req, res) => {
	// finding the genre
	const genre = genres.find((g) => g.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send("the genre was not found");

	//validation
	const { error } = genreValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// updated
	genre.name = req.body.name;

	res.send(genre);
});

//* delete route--------------------------------------------------------------------------------------
router.delete("/:id", (req, res) => {
	// finding the genre
	const genre = genres.find((g) => g.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send("the genre was not found");

	// deleting
	const index = genres.indexOf(genre);
	genres.slice(index, 1);

	res.send(genre);
});

//* validation----------------------------------------------------------------------------------------
const genreValidation = (genre) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
	});

	return schema.validate(genre);
};

module.exports = router;

const express = require("express");
const app = express();
const Joi = require("joi");

app.use(express.json());

const genres = [
	{ id: 1, name: "Action" },
	{ id: 2, name: "Comedy" },
	{ id: 3, name: "Sci-fi" },
];

//* get routes
//& welcome
app.get("/", (req, res) => {
	res.send("welcome to vidly");
});
//& get all the genres
app.get("/api/genres", (req, res) => {
	res.send(genres);
});
//& get a specific genre
app.get("/api/genre/:id", (req, res) => {
	// finding the genre
	const genre = genres.find((g) => g.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send("the genre was not found");

	res.send(genre);
});

//* post routes
app.post("/api/genres", (req, res) => {
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

//*put route
app.put("/api/genre/:id", (req, res) => {
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

//* delete route
app.delete("/api/genre/:id", (req, res) => {
	// finding the genre
	const genre = genres.find((g) => g.id === parseInt(req.params.id));
	if (!genre) return res.status(404).send("the genre was not found");

	// deleting
	const index = genres.indexOf(genre);
	genres.slice(index, 1);

	res.send(genre);
});

//* validation
const genreValidation = (genre) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
	});

	return schema.validate(genre);
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening to port 3000"));

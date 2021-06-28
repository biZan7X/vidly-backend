const express = require("express");
const app = express();
const mongoose = require("mongoose");
//& routes
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");

//& db connection
mongoose
	.connect("mongodb://localhost/vidly", { useFindAndModify: false })
	.then(() => console.log("connected to the mongodb"))
	.catch((err) => console.error("unable to connect to the db", err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

//& welcome
app.get("/", (req, res) => {
	res.send("welcome to vidly");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening to port 3000"));

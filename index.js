const express = require("express");
const app = express();
const genres = require("./routes/genres");

app.use(express.json());
app.use("/api/genres", genres);

//& welcome
app.get("/", (req, res) => {
	res.send("welcome to vidly");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening to port 3000"));

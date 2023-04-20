require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json())

const port = 5001;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers")
const { hashPassword, verifyPassword, verifyToken } = require("./auth")


//* Public Routes
app.get("/api/movies", movieHandlers.getAllMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers)
app.get("/api/users/:id", userHandlers.getUsersById)
app.post("/api/users", hashPassword, userHandlers.postUsers)

app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword)


//* Routes to protect

// app.use(verifyToken); //authentication wall


app.post("/api/movies", verifyToken, movieHandlers.createMovie)

app.put("/api/movies/:id", verifyToken, movieHandlers.updateMovie);
app.put("/api/users/:id", verifyToken, hashPassword, userHandlers.updateUser)
app.delete("/api/movies/:id",verifyToken, movieHandlers.deleteMovie)
app.delete("/api/users/:id", verifyToken, userHandlers.deleteUser)




app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

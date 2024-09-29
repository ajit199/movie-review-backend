"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controllers/movie.controller");
const router = (0, express_1.Router)();
// Add a new movie
router.post("/add", movie_controller_1.addMovie);
// Get all movies
router.get("/", movie_controller_1.getMovies);
// get a movie
router.get("/:id", movie_controller_1.getMovie);
// Update a movie
router.patch("/:id", movie_controller_1.updateMovie); // Update a movie by ID
// Delete a movie
router.delete("/:id", movie_controller_1.deleteMovie); // New route for deleting a movie by ID
exports.default = router;

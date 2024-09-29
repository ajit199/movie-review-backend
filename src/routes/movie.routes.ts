import { Router } from "express";
import {
  addMovie,
  getMovies,
  deleteMovie,
  getMovie,
  updateMovie,
} from "../controllers/movie.controller";

const router = Router();

// Add a new movie
router.post("/add", addMovie);

// Get all movies
router.get("/", getMovies);

// get a movie
router.get("/:id", getMovie);
// Update a movie
router.patch("/:id", updateMovie); // Update a movie by ID

// Delete a movie
router.delete("/:id", deleteMovie); // New route for deleting a movie by ID

export default router;

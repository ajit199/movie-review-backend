import { Request, Response } from "express";
import Movie from "../models/movie.model";
import Review from "../models/review.model"; // Import Review model
import { ObjectId } from "mongodb";

// Add a new movie
export const addMovie = async (req: Request, res: Response) => {
  const { name, releaseDate, averageRating } = req.body;

  try {
    const newMovie = new Movie({
      name,
      releaseDate,
      averageRating,
    });

    const savedMovie = await newMovie.save();
    res.json(savedMovie);
  } catch (error) {
    res.status(500).send("Error creating movie");
  }
};

// Get all movies
export const getMovies = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    const movies = await Movie.find(filter);
    res.json({ data: movies });
  } catch (error) {
    res.status(500).send("Error fetching movies");
  }
};

// Get a movie
export const getMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let movie = await Movie.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "movie",
          as: "reviews",
        },
      },
    ]);

    movie = movie[0];
    res.json({ data: movie });
  } catch (error) {
    res.status(500).send("Error fetching movie");
  }
};

// Update a movie by ID
export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the movie ID from URL parameters
  const { name, releaseDate, averageRating } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { name, releaseDate: new Date(releaseDate), averageRating },
      { new: true } // Return the updated document
    );

    if (!updatedMovie) {
      res.status(404).send("Movie not found");
    } else {
      res.json(updatedMovie);
    }
  } catch (error) {
    res.status(500).send("Error updating movie");
  }
};

// Delete a movie by ID and associated reviews
export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the movie ID from URL parameters

  try {
    // Delete all reviews associated with the movie
    await Review.deleteMany({ movie: new ObjectId(id) });

    // Delete the movie
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      res.status(404).send("Movie not found");
    } else {
      res.json({
        message: "Movie and associated reviews deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).send("Error deleting movie");
  }
};

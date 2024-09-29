import { Request, Response } from "express";
import Review from "../models/review.model";
import Movie from "../models/movie.model"; // Import Movie model
import { ObjectId } from "mongodb";

// Add a new review
export const addReview = async (req: Request, res: Response) => {
  const { movie, reviewerName, rating, reviewComments } = req.body;

  try {
    const newReview = new Review({
      movie,
      reviewerName,
      rating,
      reviewComments,
    });

    const savedReview = await newReview.save();

    // Update the average rating for the associated movie
    await updateAverageRating(movie);

    res.json(savedReview);
  } catch (error) {
    res.status(500).send("Error creating review");
  }
};

// Get all movies
export const getMovieReviews = async (req: Request, res: Response) => {
  const movieId: any | ObjectId = req.query.movieId;
  try {
    const reviews = await Review.aggregate([
      {
        $match: {
          movie: new ObjectId(movieId),
        },
      },
    ]);
    res.json({ data: reviews });
  } catch (error) {
    res.status(500).send("Error fetching movies");
  }
};

// Get a movie
export const getReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    res.json({ data: review });
  } catch (error) {
    res.status(500).send("Error fetching movie");
  }
};

// Update a review by ID
export const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the review ID from URL parameters
  console.log("id", id);

  const { movie, reviewerName, rating, reviewComments } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { movie, reviewerName, rating, reviewComments },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedReview) {
      res.status(404).send("Review not found");
    } else {
      // Update the average rating for the associated movie
      await updateAverageRating(updatedReview.movie);

      res.json(updatedReview);
    }
  } catch (error) {
    res.status(500).send("Error updating review");
  }
};

// Delete a review by ID
export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the review ID from URL parameters

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      res.status(404).send("Review not found");
    } else {
      // Update the average rating for the associated movie
      await updateAverageRating(deletedReview.movie);

      res.json({ message: "Review deleted successfully" });
    }
  } catch (error) {
    res.status(500).send("Error deleting review");
  }
};

// Helper function to update the average rating of a movie
const updateAverageRating = async (movieId: ObjectId) => {
  const reviews = await Review.find({ movie: new ObjectId(movieId) });

  console.log("reviews", reviews);

  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, { averageRating: null }); // Set to null if no reviews
  } else {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Movie.findByIdAndUpdate(movieId, { averageRating });
  }
};

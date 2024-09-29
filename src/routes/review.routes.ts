import { Router } from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  getMovieReviews,
  getReview,
} from "../controllers/review.controller";

const router = Router();

// Add a new review
router.post("/add", addReview);

// get a movie all reviews
router.get("/", getMovieReviews);

// get a review
router.get("/:id", getReview);

// update a review
router.patch("/:id", updateReview);

// delete a review
router.delete("/:id", deleteReview);

export default router;

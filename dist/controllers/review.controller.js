"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReview = exports.getMovieReviews = exports.addReview = void 0;
const review_model_1 = __importDefault(require("../models/review.model"));
const movie_model_1 = __importDefault(require("../models/movie.model")); // Import Movie model
const mongodb_1 = require("mongodb");
// Add a new review
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movie, reviewerName, rating, reviewComments } = req.body;
    try {
        const newReview = new review_model_1.default({
            movie,
            reviewerName,
            rating,
            reviewComments,
        });
        const savedReview = yield newReview.save();
        // Update the average rating for the associated movie
        yield updateAverageRating(movie);
        res.json(savedReview);
    }
    catch (error) {
        res.status(500).send("Error creating review");
    }
});
exports.addReview = addReview;
// Get all movies
const getMovieReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movieId = req.query.movieId;
    try {
        const reviews = yield review_model_1.default.aggregate([
            {
                $match: {
                    movie: new mongodb_1.ObjectId(movieId),
                },
            },
        ]);
        res.json({ data: reviews });
    }
    catch (error) {
        res.status(500).send("Error fetching movies");
    }
});
exports.getMovieReviews = getMovieReviews;
// Get a movie
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const review = yield review_model_1.default.findById(id);
        res.json({ data: review });
    }
    catch (error) {
        res.status(500).send("Error fetching movie");
    }
});
exports.getReview = getReview;
// Update a review by ID
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the review ID from URL parameters
    console.log("id", id);
    const { movie, reviewerName, rating, reviewComments } = req.body;
    try {
        const updatedReview = yield review_model_1.default.findByIdAndUpdate(id, { movie, reviewerName, rating, reviewComments }, { new: true, runValidators: true } // Return the updated document
        );
        if (!updatedReview) {
            res.status(404).send("Review not found");
        }
        else {
            // Update the average rating for the associated movie
            yield updateAverageRating(updatedReview.movie);
            res.json(updatedReview);
        }
    }
    catch (error) {
        res.status(500).send("Error updating review");
    }
});
exports.updateReview = updateReview;
// Delete a review by ID
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the review ID from URL parameters
    try {
        const deletedReview = yield review_model_1.default.findByIdAndDelete(id);
        if (!deletedReview) {
            res.status(404).send("Review not found");
        }
        else {
            // Update the average rating for the associated movie
            yield updateAverageRating(deletedReview.movie);
            res.json({ message: "Review deleted successfully" });
        }
    }
    catch (error) {
        res.status(500).send("Error deleting review");
    }
});
exports.deleteReview = deleteReview;
// Helper function to update the average rating of a movie
const updateAverageRating = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.default.find({ movie: new mongodb_1.ObjectId(movieId) });
    console.log("reviews", reviews);
    if (reviews.length === 0) {
        yield movie_model_1.default.findByIdAndUpdate(movieId, { averageRating: null }); // Set to null if no reviews
    }
    else {
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        yield movie_model_1.default.findByIdAndUpdate(movieId, { averageRating });
    }
});

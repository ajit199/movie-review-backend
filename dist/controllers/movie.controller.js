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
exports.deleteMovie = exports.updateMovie = exports.getMovie = exports.getMovies = exports.addMovie = void 0;
const movie_model_1 = __importDefault(require("../models/movie.model"));
const review_model_1 = __importDefault(require("../models/review.model")); // Import Review model
const mongodb_1 = require("mongodb");
// Add a new movie
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, releaseDate, averageRating } = req.body;
    try {
        const newMovie = new movie_model_1.default({
            name,
            releaseDate,
            averageRating,
        });
        const savedMovie = yield newMovie.save();
        res.json(savedMovie);
    }
    catch (error) {
        res.status(500).send("Error creating movie");
    }
});
exports.addMovie = addMovie;
// Get all movies
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    try {
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
        }
        const movies = yield movie_model_1.default.find(filter);
        res.json({ data: movies });
    }
    catch (error) {
        res.status(500).send("Error fetching movies");
    }
});
exports.getMovies = getMovies;
// Get a movie
const getMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        let movie = yield movie_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(id),
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
    }
    catch (error) {
        res.status(500).send("Error fetching movie");
    }
});
exports.getMovie = getMovie;
// Update a movie by ID
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the movie ID from URL parameters
    const { name, releaseDate, averageRating } = req.body;
    try {
        const updatedMovie = yield movie_model_1.default.findByIdAndUpdate(id, { name, releaseDate: new Date(releaseDate), averageRating }, { new: true } // Return the updated document
        );
        if (!updatedMovie) {
            res.status(404).send("Movie not found");
        }
        else {
            res.json(updatedMovie);
        }
    }
    catch (error) {
        res.status(500).send("Error updating movie");
    }
});
exports.updateMovie = updateMovie;
// Delete a movie by ID and associated reviews
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the movie ID from URL parameters
    try {
        // Delete all reviews associated with the movie
        yield review_model_1.default.deleteMany({ movie: new mongodb_1.ObjectId(id) });
        // Delete the movie
        const deletedMovie = yield movie_model_1.default.findByIdAndDelete(id);
        if (!deletedMovie) {
            res.status(404).send("Movie not found");
        }
        else {
            res.json({
                message: "Movie and associated reviews deleted successfully",
            });
        }
    }
    catch (error) {
        res.status(500).send("Error deleting movie");
    }
});
exports.deleteMovie = deleteMovie;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const router = (0, express_1.Router)();
// Add a new review
router.post("/add", review_controller_1.addReview);
// get a movie all reviews
router.get("/", review_controller_1.getMovieReviews);
// get a review
router.get("/:id", review_controller_1.getReview);
// update a review
router.patch("/:id", review_controller_1.updateReview);
// delete a review
router.delete("/:id", review_controller_1.deleteReview);
exports.default = router;

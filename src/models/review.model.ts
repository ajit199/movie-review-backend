import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the Review document
interface IReview extends Document {
  movie: mongoose.Types.ObjectId;
  reviewerName?: string;
  rating: number;
  reviewComments: string;
}

// Create the schema for Review
const reviewSchema: Schema = new Schema({
  movie: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  reviewerName: { type: String, default: "Unknown" },
  rating: { type: Number, min: 0, max: 10, required: true },
  reviewComments: { type: String, required: true },
});

// Create and export the Review model
const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;

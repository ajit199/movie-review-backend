import mongoose, { Schema, Document } from "mongoose";

// interface for movie
interface IMovie extends Document {
  name: string;
  releaseDate: Date;
  averageRating?: number | null;
}

// Create the schema
const movieSchema: Schema = new Schema({
  name: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  averageRating: { type: Number, min: 0, max: 10, default: null },
});

// export the model
const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;

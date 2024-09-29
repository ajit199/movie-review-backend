import express, { Request, Response } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import movieRoutes from "./routes/movie.routes";
import reviewRoutes from "./routes/review.routes";

const app = express();
const PORT = 5500;

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware for routing
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Connect to MongoDB

const user = "dbUser";
const password = "4a3Wym2peE!x4nw";
const connectionString = `mongodb+srv://${user}:${password}@cluster0.qwry3.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(connectionString)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running.`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));

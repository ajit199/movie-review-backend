"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const movie_routes_1 = __importDefault(require("./routes/movie.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const app = (0, express_1.default)();
const PORT = 5500;
// Middlewares
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// Middleware for routing
app.use("/api/v1/movies", movie_routes_1.default);
app.use("/api/v1/reviews", review_routes_1.default);
// Connect to MongoDB
const user = "dbUser";
const password = "4a3Wym2peE!x4nw";
const connectionString = `mongodb+srv://${user}:${password}@cluster0.qwry3.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0`;
mongoose_1.default
    .connect(connectionString)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running.`);
    });
})
    .catch((error) => console.error("MongoDB connection error:", error));

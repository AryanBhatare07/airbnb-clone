import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
import bookingRoutes from "./routes/booking.route.js";
import reviewRoutes from "./routes/review.route.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/api/listings',listingRoutes)
app.use('/api/bookings',bookingRoutes)
app.use('/api/reviews',reviewRoutes)


app.get("/", (req, res) => {
  res.json({ message: "Airbnb Clone API is running!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB()
});
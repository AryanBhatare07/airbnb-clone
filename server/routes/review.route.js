import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createReview, getListingReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/listing/:listingId", getListingReviews);

export default router;
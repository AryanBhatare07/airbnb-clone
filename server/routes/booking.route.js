import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { cancelBooking, createBooking, getHostBookings, getMyBookings } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.get("/host-bookings", authMiddleware, getHostBookings);
router.patch("/:id/cancel", authMiddleware, cancelBooking);

export default router;
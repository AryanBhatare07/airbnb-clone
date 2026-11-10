import express from 'express'
import { createListing, deleteListing, getAllListings, getListingById, getMyListings, updateListing } from '../controllers/listing.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import upload from '../middlewares/upload.middleware.js'

const router = express.Router()

router.get('/',getAllListings)
router.get("/my-listings", authMiddleware, getMyListings);
router.get('/:id',getListingById)
router.post("/",authMiddleware,upload.array("images", 5),createListing);
router.patch("/:id",authMiddleware,upload.array("images", 5),updateListing);
router.delete("/:id", authMiddleware, deleteListing);

export default router
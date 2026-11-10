# Airbnb Clone

A full-stack Airbnb Clone built using the MERN Stack.

## Features

- User Registration and Login
- Guest and Host Roles
- Become a Host Functionality
- Create, Edit and Delete Listings
- Cloudinary Image Upload
- Search and Filter Listings
- Property Details with Map
- Booking System
- Booking Date Validation
- Prevent Overlapping Bookings
- My Bookings Dashboard
- Host Dashboard
- Review and Rating System
- Responsive UI

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Leaflet

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer

## Installation

### 1. Clone Repository

git clone https://github.com/AryanBhatare07/airbnb-clone.git

### 2. Backend Setup

cd server
npm install

Create a .env file and configure:

PORT=8000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Start backend:

npm run dev

### 3. Frontend Setup

Open another terminal:

cd client
npm install

Create a .env file:

VITE_API_URL=http://localhost:8000/api

Start frontend:

npm run dev

## Author

Aryan Bhatare

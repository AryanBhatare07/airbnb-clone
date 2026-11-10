
# 🏡 Airbnb Clone

A full-stack property rental platform inspired by Airbnb, built using the MERN Stack. Users can explore properties, search and filter listings, book stays, and manage their own property listings through a dedicated host dashboard.

## ✨ Features

### 🔐 Authentication & User Management
- User Registration and Login
- JWT-based Authentication
- Guest and Host Roles
- Become a Host Functionality

### 🏠 Property Listings
- Create, Edit and Delete Property Listings
- Upload Property Images using Cloudinary
- Search and Filter Properties
- Property Details with Images and Amenities
- Interactive Map using React Leaflet

### 📅 Booking Management
- Book Properties with Check-in and Check-out Dates
- Booking Date Validation
- Prevent Overlapping Bookings
- View and Manage Personal Bookings
- Host Booking Dashboard

### ⭐ Reviews & Ratings
- Submit Reviews for Completed Stays
- Rating System
- Display Property Reviews and Average Ratings

### 🎨 User Interface
- Responsive Design
- Modern and Clean UI
- Property Image Gallery
- Loading and Empty States

---

## 🛠️ Tech Stack

| Frontend | Backend | Database & Services |
|---|---|---|
| React | Node.js | MongoDB |
| Vite | Express.js | Mongoose |
| Tailwind CSS | JWT | Cloudinary |
| Axios | Multer | OpenStreetMap |
| React Router | | React Leaflet |

---

## 📂 Project Structure

```text
airbnb-clone/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/AryanBhatare07/airbnb-clone.git
cd airbnb-clone
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=8000
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

Open the application at:

http://localhost:5173

---

## 🔒 Environment Variables

Make sure to configure your own MongoDB and Cloudinary credentials before running the project.

**Never upload your `.env` files or secret credentials to GitHub.**

---

## 👨‍💻 Author

**Aryan Bhatare**

Computer Engineering Graduate | Full Stack Developer

[GitHub](https://github.com/AryanBhatare07)

---

⭐ If you find this project interesting, consider giving it a star!

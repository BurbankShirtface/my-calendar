# Quick Setup Guide

## Step 1: Backend Setup

1. Navigate to server folder:
   ```bash
   cd server
   ```

2. Create `.env` file with:
   ```
   MONGODB_URI=mongodb://localhost:27017/my-calendar
   PORT=5000
   NODE_ENV=development
   ```
   
   **OR if using MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/my-calendar
   PORT=5000
   NODE_ENV=development
   ```

3. Install and run:
   ```bash
   npm install
   npm start
   ```
   
   Server runs on http://localhost:5000

## Step 2: Frontend Setup

1. Go back to root directory:
   ```bash
   cd ..
   ```

2. Create `.env` file in root with:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_ADMIN_PASSWORD=your-password-here
   ```

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   
   Frontend runs on http://localhost:5173

## Step 3: Test the App

1. Open http://localhost:5173 in your browser
2. Click "Admin Access" and enter your password
3. Try adding a new project

## Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running locally or your Atlas connection string is correct
- **CORS errors**: Check that backend CORS settings include `http://localhost:5173`
- **Environment variables not working**: Make sure `.env` files are in the correct directories and restart the servers
- **Port already in use**: Change PORT in server/.env or kill the process using port 5000/5173

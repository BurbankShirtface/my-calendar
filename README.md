# Montgomery Construction Calendar

This is a timeslot tracker and booker for a construction business. Users can view only. Admin can edit.

A calendar application for managing construction projects with start and end dates.

## Features

- View projects on a calendar
- Admin authentication for project management
- Add, edit, and delete projects
- Color-coded projects
- Date range validation
- Month expansion with fullscreen view
- Year selector (only shows years with projects)
- Sortable project list

## Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/my-calendar
   PORT=5000
   NODE_ENV=development
   ```

   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/my-calendar
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. In the root directory, create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_ADMIN_PASSWORD=your-admin-password-here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Project Structure

```
my-calendar/
├── server/              # Backend Express server
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   └── server.js       # Server entry point
├── src/                # React frontend
│   ├── components/     # React components
│   └── App.jsx         # Main app component
└── public/             # Static assets
```

## API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

## Deployment

This app is configured for deployment on Render. See `render.yaml` for configuration.

### Environment Variables for Production

**Backend:**
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

**Frontend:**
- `VITE_API_URL` - Backend API URL
- `VITE_ADMIN_PASSWORD` - Admin password for authentication

## Recent Fixes

- Fixed hardcoded localhost URLs in update/delete functions
- Improved error handling with better error messages
- Added date validation (end date must be after start date)
- Fixed timezone issues with date parsing
- Added persistent login (localStorage, 7-day expiry)
- Fixed duplicate form fields in Add Project modal
- Added month expansion feature with fullscreen view
- Added year selector (only shows years with projects)
- Improved ProjectList: default sort newest first, sortable by date
- Fixed calendar overflow issues and improved responsive design
- Improved form labels and date formatting

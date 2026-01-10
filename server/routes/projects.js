const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ startDate: 1 }); // Sort by start date

    // Return empty array instead of 404 if no projects found
    res.json(projects || []);
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
    
    // Check for MongoDB connection errors
    if (error.name === "MongooseError" && error.message.includes("buffering timed out")) {
      return res.status(503).json({
        message: "Database connection timeout",
        error: "Unable to connect to MongoDB. Please check your database connection string and ensure MongoDB is running.",
      });
    }
    
    // Send a more detailed error response
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Add a new project
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.startDate || !req.body.endDate || !req.body.name) {
      return res.status(400).json({
        message: "Missing required fields: startDate, endDate, and name are required",
        error: "ValidationError",
      });
    }

    // Validate date range
    if (new Date(req.body.endDate) < new Date(req.body.startDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
        error: "ValidationError",
      });
    }

    const project = new Project({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      name: req.body.name.trim(),
      color: req.body.color || "#ffca3a",
    });

    const newProject = await project.save();
    console.log("Project created:", newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    
    // Check for MongoDB connection errors
    if (error.name === "MongooseError" && error.message.includes("buffering timed out")) {
      return res.status(503).json({
        message: "Database connection timeout",
        error: "Unable to connect to MongoDB. Please check your database connection string and ensure MongoDB is running.",
      });
    }
    
    res.status(400).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
});

// Update a project
router.put("/:id", async (req, res) => {
  try {
    // Validate date range if both dates are provided
    if (req.body.startDate && req.body.endDate) {
      if (new Date(req.body.endDate) < new Date(req.body.startDate)) {
        return res.status(400).json({
          message: "End date must be after start date",
          error: "ValidationError",
        });
      }
    }

    const updateData = {};
    if (req.body.startDate) updateData.startDate = req.body.startDate;
    if (req.body.endDate) updateData.endDate = req.body.endDate;
    if (req.body.name) updateData.name = req.body.name.trim();
    if (req.body.color) updateData.color = req.body.color;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // This option returns the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ 
        message: "Project not found",
        error: "NotFoundError",
      });
    }

    console.log("Project updated:", updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error("Error in PUT /api/projects/:id:", error);
    res.status(400).json({ 
      message: "Failed to update project",
      error: error.message,
    });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE /api/projects/:id request received:", req.params.id);
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Project deleted:", deletedProject);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/projects/:id:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

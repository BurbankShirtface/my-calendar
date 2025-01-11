const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    if (!projects) {
      return res.status(404).json({
        message: "No projects found",
        error: null,
      });
    }

    res.json(projects);
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
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
    const project = new Project({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      name: req.body.name,
      color: req.body.color,
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    res.status(400).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
});

// Update a project
router.put("/:id", async (req, res) => {
  try {
    console.log(
      "PUT /api/projects/:id request received:",
      req.params.id,
      req.body
    );
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        name: req.body.name,
        color: req.body.color,
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Project updated:", updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error("Error in PUT /api/projects/:id:", error);
    res.status(400).json({ message: error.message });
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

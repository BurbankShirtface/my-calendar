const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all projects
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/projects request received");
    console.log("Request headers:", req.headers);

    const projects = await Project.find();
    console.log("Projects found in database:", projects);

    console.log("Sending response:", projects);
    res.json(projects);
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add a new project
router.post("/", async (req, res) => {
  const project = new Project({
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    name: req.body.name,
    color: req.body.color,
  });

  try {
    console.log("POST /api/projects request received:", req.body);
    const newProject = await project.save();
    console.log("New project saved:", newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error in POST /api/projects:", error);
    res.status(400).json({ message: error.message });
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

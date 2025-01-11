import { useState, useEffect } from "react";
import "./App.css";
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import ProjectList from "./components/ProjectList";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [projects, setProjects] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleAdminAccess = () => {
    setShowAdminModal(true);
  };

  const handleLogin = (password) => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      setShowAdminModal(false);
    } else {
      alert("Invalid password");
    }
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowNewProjectModal(true);
  };

  const handleViewProjects = () => {
    setShowProjectList(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowNewProjectModal(false);
    setShowProjectList(false);
    setEditingProject(null);
  };

  const handleAddProject = async (projectData) => {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setShowNewProjectModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowNewProjectModal(true);
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const updatedProject = await response.json();
      setProjects(
        projects.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      setShowNewProjectModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="app">
      <Header
        onAdminClick={handleAdminAccess}
        isAuthenticated={isAuthenticated}
        onNewProject={handleNewProject}
        onViewProjects={handleViewProjects}
        onLogout={handleLogout}
      />
      <main>
        <Calendar projects={projects} />
      </main>

      {showAdminModal && !isAuthenticated && (
        <div className="modal">
          <div className="modal-content">
            <h2>Admin Access</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(e.target.password.value);
              }}
            >
              <input
                type="password"
                name="password"
                placeholder="Enter admin password"
                required
              />
              <div className="button-group">
                <button type="submit">Login</button>
                <button type="button" onClick={() => setShowAdminModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewProjectModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingProject ? "Edit Project" : "Add Project"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const projectData = {
                  startDate: e.target.startDate.value,
                  endDate: e.target.endDate.value,
                  name: e.target.projectName.value,
                  color: e.target.projectColor.value,
                };

                if (editingProject) {
                  handleUpdateProject({
                    ...projectData,
                    _id: editingProject._id,
                  });
                } else {
                  handleAddProject(projectData);
                }
              }}
            >
              <input
                type="date"
                name="startDate"
                required
                defaultValue={editingProject?.startDate}
              />
              <input
                type="date"
                name="endDate"
                required
                defaultValue={editingProject?.endDate}
              />
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                required
                defaultValue={editingProject?.name}
              />
              <input
                type="color"
                name="projectColor"
                defaultValue={editingProject?.color || "#ffca3a"}
              />
              <div className="button-group">
                <button type="submit">
                  {editingProject ? "Update Project" : "Add Project"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProjectModal(false);
                    setEditingProject(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectList && (
        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onClose={() => setShowProjectList(false)}
        />
      )}
    </div>
  );
}

export default App;

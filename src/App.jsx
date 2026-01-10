import { useState, useEffect } from "react";
import "./App.css";
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import ProjectList from "./components/ProjectList";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, ""); // Remove trailing slash if present

// Parse date strings as local dates to avoid timezone issues
const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

function App() {
  const [projects, setProjects] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously authenticated
    const authData = localStorage.getItem('adminAuth');
    if (authData) {
      try {
        const { timestamp } = JSON.parse(authData);
        // Check if session is less than 7 days old (optional: can adjust expiry time)
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < sevenDaysInMs) {
          return true;
        } else {
          // Session expired, clear it
          localStorage.removeItem('adminAuth');
          return false;
        }
      } catch (e) {
        localStorage.removeItem('adminAuth');
        return false;
      }
    }
    return false;
  });
  const [editingProject, setEditingProject] = useState(null);

  const handleAdminAccess = () => {
    setShowAdminModal(true);
  };

  const handleLogin = (password) => {
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    // Debug: Check if env variable is set (only log in console, don't expose value)
    if (!envPassword) {
      console.error("VITE_ADMIN_PASSWORD environment variable is not set!");
      alert("Configuration error: Admin password is not configured. Please check environment variables.");
      return;
    }
    
    if (password === envPassword) {
      setIsAuthenticated(true);
      setShowAdminModal(false);
      // Save authentication state to localStorage with timestamp
      localStorage.setItem('adminAuth', JSON.stringify({
        timestamp: Date.now()
      }));
    } else {
      // Debug logging (password value not exposed)
      console.log("Login attempt failed - password mismatch");
      alert("Invalid credentials. Please check your password.");
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
    // Clear authentication from localStorage
    localStorage.removeItem('adminAuth');
  };

  const handleAddProject = async (projectData) => {
    try {
      // Validate dates (using local date parsing)
      if (parseLocalDate(projectData.endDate) < parseLocalDate(projectData.startDate)) {
        alert("End date must be after start date");
        return;
      }

      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Failed to add project: ${response.status}`);
      }

      const newProject = await response.json();
      // Refresh projects list to ensure we have the latest data
      await fetchProjects();
      setShowNewProjectModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
      alert(`Failed to add project: ${error.message}`);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowNewProjectModal(true);
  };

  const handleUpdateProject = async (projectData) => {
    try {
      // Validate dates (using local date parsing)
      if (parseLocalDate(projectData.endDate) < parseLocalDate(projectData.startDate)) {
        alert("End date must be after start date");
        return;
      }

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update project: ${response.status}`);
      }

      const updatedProject = await response.json();
      setProjects(
        projects.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      setShowNewProjectModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
      alert(`Failed to update project: ${error.message}`);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete project: ${response.status}`);
      }

      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(`Failed to delete project: ${error.message}`);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched projects:", data); // Add this to debug
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
              <label>
                Start Date
                <input
                  type="date"
                  name="startDate"
                  required
                  defaultValue={editingProject?.startDate?.split('T')[0] || ''}
                />
              </label>
              <label>
                End Date
                <input
                  type="date"
                  name="endDate"
                  required
                  defaultValue={editingProject?.endDate?.split('T')[0] || ''}
                />
              </label>
              <label>
                Project Name
                <input
                  type="text"
                  name="projectName"
                  placeholder="Project Name"
                  required
                  defaultValue={editingProject?.name}
                />
              </label>
              <label>
                Color
                <input
                  type="color"
                  name="projectColor"
                  defaultValue={editingProject?.color || "#ffca3a"}
                />
              </label>
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

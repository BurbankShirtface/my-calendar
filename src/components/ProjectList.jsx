import "./ProjectList.css";
import { useState } from "react";

function ProjectList({ projects, onEdit, onDelete, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (project) => {
    onEdit(project);
    onClose();
  };

  // Sort projects by start date
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  // Filter projects by name
  const filteredProjects = sortedProjects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="project-list-modal">
      <div className="project-list-content">
        <div className="modal-header">
          <h2>All Projects</h2>
          <button className="close-button-top" onClick={onClose}>
            ×
          </button>
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="project-table">
          <div className="project-header">
            <div>Project Name</div>
            <div>Start Date</div>
            <div>End Date</div>
            <div>Color</div>
            <div>Actions</div>
          </div>
          {filteredProjects.map((project) => (
            <div key={project._id} className="project-row">
              <div>{project.name}</div>
              <div>{new Date(project.startDate).toLocaleDateString()}</div>
              <div>{new Date(project.endDate).toLocaleDateString()}</div>
              <div>
                <div
                  className="color-preview"
                  style={{ backgroundColor: project.color }}
                />
              </div>
              <div className="action-buttons">
                <button onClick={() => handleEdit(project)}>Edit</button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this project?"
                      )
                    ) {
                      onDelete(project._id);
                    }
                  }}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ProjectList;

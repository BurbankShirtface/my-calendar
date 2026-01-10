import "./ProjectList.css";
import { useState } from "react";

function ProjectList({ projects, onEdit, onDelete, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc" - default to desc (newest first)

  const handleEdit = (project) => {
    onEdit(project);
    onClose();
  };

  // Sort projects by start date (using local date parsing)
  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = parseLocalDate(a.startDate);
    const dateB = parseLocalDate(b.startDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

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
            <div className="sortable-header" onClick={handleSortToggle}>
              Start Date
              <span className={`sort-arrow ${sortOrder === "asc" ? "sort-arrow-up" : "sort-arrow-down"}`}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            </div>
            <div>End Date</div>
            <div>Color</div>
            <div>Actions</div>
          </div>
          {filteredProjects.map((project) => (
              <div key={project._id} className="project-row">
                <div>{project.name}</div>
                <div>{parseLocalDate(project.startDate).toLocaleDateString()}</div>
                <div>{parseLocalDate(project.endDate).toLocaleDateString()}</div>
              <div>
                <div
                  className="color-preview"
                  style={{ backgroundColor: project.color }}
                />
              </div>
              <div className="action-buttons">
                <button onClick={() => handleEdit(project)}>Edit</button>
                <button
                  onClick={() => onDelete(project._id)}
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

import "./ProjectList.css";
import { useState, useEffect } from "react";

function ProjectList({ projects, onEdit, onDelete, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc" - default to desc (newest first)
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const handleEdit = (project) => {
    onEdit(project);
    onClose();
  };

  // Sort projects by start date (using local date parsing)
  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Get years that have projects (from start or end dates)
  const getAvailableYears = () => {
    const years = new Set();
    projects.forEach((project) => {
      if (project.startDate) {
        const year = parseInt(project.startDate.split('-')[0]);
        if (year && !isNaN(year)) years.add(year);
      }
      if (project.endDate) {
        const year = parseInt(project.endDate.split('-')[0]);
        if (year && !isNaN(year)) years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // Filter projects by year - show projects that overlap with the selected year
  const projectsInYear = (project) => {
    const startYear = parseInt(project.startDate?.split('-')[0]);
    const endYear = parseInt(project.endDate?.split('-')[0]);
    if (isNaN(startYear) || isNaN(endYear)) return false;
    return startYear <= selectedYear && endYear >= selectedYear;
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const availableYears = getAvailableYears();

  // Default to most recent year with projects if current year has none
  useEffect(() => {
    const years = getAvailableYears();
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const yearFilteredProjects = availableYears.length > 0
    ? projects.filter(projectsInYear)
    : projects;

  const sortedProjects = [...yearFilteredProjects].sort((a, b) => {
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
        <div className="project-list-filters">
          <div className="year-filter-group">
            <label htmlFor="project-list-year" className="year-filter-label">
              Year:
            </label>
            <select
              id="project-list-year"
              className="year-filter-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>
              )}
            </select>
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
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

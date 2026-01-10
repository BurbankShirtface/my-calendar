import { useState, useEffect } from "react";
import "./Calendar.css";

function Calendar({ projects }) {
  const [months, setMonths] = useState([]);
  const [expandedMonth, setExpandedMonth] = useState(null); // null or month index
  
  // Get initial year from projects or use current year
  const getInitialYear = () => {
    if (projects.length === 0) return new Date().getFullYear();
    
    const years = new Set();
    projects.forEach(project => {
      if (project.startDate) {
        const year = parseInt(project.startDate.split('-')[0]);
        if (year && !isNaN(year)) years.add(year);
      }
      if (project.endDate) {
        const year = parseInt(project.endDate.split('-')[0]);
        if (year && !isNaN(year)) years.add(year);
      }
    });
    
    if (years.size > 0) {
      return Math.max(...Array.from(years)); // Use most recent year
    }
    
    return new Date().getFullYear();
  };
  
  const [selectedYear, setSelectedYear] = useState(getInitialYear());

  const getMonthsForYear = (year) => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(year, i, 1);
      months.push(month);
    }
    return months;
  };

  // Get available years from projects - only years that actually have projects
  const getAvailableYears = () => {
    const years = new Set();
    
    // Only add years from projects
    projects.forEach(project => {
      if (project.startDate) {
        const year = parseInt(project.startDate.split('-')[0]);
        if (year && !isNaN(year)) years.add(year);
      }
      if (project.endDate) {
        const year = parseInt(project.endDate.split('-')[0]);
        if (year && !isNaN(year)) years.add(year);
      }
    });
    
    const yearArray = Array.from(years).sort((a, b) => b - a); // Sort descending
    
    // If no projects, default to current year
    if (yearArray.length === 0) {
      return [new Date().getFullYear()];
    }
    
    return yearArray;
  };

  // Debug: Log projects when they change
  useEffect(() => {
    console.log("Calendar received projects:", projects);
  }, [projects]);

  // Update months when year changes
  useEffect(() => {
    setMonths(getMonthsForYear(selectedYear));
  }, [selectedYear]);

  // Update selected year if current year is not available in projects
  useEffect(() => {
    const availableYears = getAvailableYears();
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]); // Set to most recent year with projects
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // Helper function to render a month calendar
  const renderMonth = (month, monthIndex, isExpanded = false) => {
    const parseLocalDate = (dateString) => {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const firstDayOfMonth = new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).getDate();

    // Add empty cells for days before the first day of the month
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => (
      <div key={`empty-${i}`} className="day empty"></div>
    ));

    // Add cells for each day of the month
    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(
        month.getFullYear(),
        month.getMonth(),
        i + 1
      );
      const dayProjects = projects.filter((project) => {
        const startDate = parseLocalDate(project.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = parseLocalDate(project.endDate);
        endDate.setHours(23, 59, 59, 999);
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        return dayStart >= startDate && dayStart <= endDate;
      });

      return (
        <div
          key={i + 1}
          className={`day ${
            dayProjects.length > 0 ? "has-projects" : ""
          }`}
        >
          <span className="day-number">{i + 1}</span>
          {dayProjects.map((project, index) => (
            <div
              key={project._id || index}
              className={isExpanded ? "project-label" : "project-indicator"}
              style={{ backgroundColor: project.color }}
              title={project.name}
            >
              {isExpanded && <span className="project-name">{project.name}</span>}
            </div>
          ))}
        </div>
      );
    });

    return [...emptyDays, ...dayCells];
  };

  // If a month is expanded, show fullscreen view
  if (expandedMonth !== null) {
    const month = months[expandedMonth];
    return (
      <div className="expanded-month-overlay">
        <div className="expanded-month-container">
          <button 
            className="close-expanded-month" 
            onClick={() => setExpandedMonth(null)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="expanded-month">
            <div className="expanded-month-header">
              <h2 className="expanded-month-title">
                {month.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="expanded-year-selector-container">
                <label htmlFor="expanded-year-select" className="year-selector-label">
                  Year:
                </label>
                <select
                  id="expanded-year-select"
                  className="year-selector"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="days expanded-days">
              <div className="day-header">Sun</div>
              <div className="day-header">Mon</div>
              <div className="day-header">Tue</div>
              <div className="day-header">Wed</div>
              <div className="day-header">Thu</div>
              <div className="day-header">Fri</div>
              <div className="day-header">Sat</div>
              {renderMonth(month, expandedMonth, true)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal 12-month grid view
  return (
    <div className="calendar-wrapper">
      <div className="year-selector-container">
        <label htmlFor="year-select" className="year-selector-label">
          Year:
        </label>
        <select
          id="year-select"
          className="year-selector"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {getAvailableYears().map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="calendar-grid">
        {months.map((month, monthIndex) => (
          <div 
            key={monthIndex} 
            className="month"
            onClick={() => setExpandedMonth(monthIndex)}
            style={{ cursor: 'pointer' }}
          >
            <h2>
              {month.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="days">
              <div className="day-header">Sun</div>
              <div className="day-header">Mon</div>
              <div className="day-header">Tue</div>
              <div className="day-header">Wed</div>
              <div className="day-header">Thu</div>
              <div className="day-header">Fri</div>
              <div className="day-header">Sat</div>
              {renderMonth(month, monthIndex, false)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;

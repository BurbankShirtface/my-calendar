import { useState, useEffect } from "react";
import "./Calendar.css";

function Calendar({ projects }) {
  const [months, setMonths] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  // Add console log to see incoming projects
  console.log("Calendar received projects:", projects);

  const getNext12Months = () => {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push(month);
    }

    return months;
  };

  // Update months at midnight and when component mounts
  useEffect(() => {
    const updateMonths = () => {
      setMonths(getNext12Months());
    };

    // Initial update
    updateMonths();

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    // Set up the daily update
    const timeout = setTimeout(() => {
      updateMonths();
      // After first update, update every 24 hours
      const interval = setInterval(updateMonths, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const handleDayClick = (date) => {
    // If clicking the same day, close the popup
    if (selectedDay && selectedDay.getTime() === date.getTime()) {
      setSelectedDay(null);
    } else {
      setSelectedDay(date);
    }
  };

  const getProjectsForDay = (date) => {
    return projects.filter((project) => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  return (
    <div className="calendar-grid">
      {months.map((month, monthIndex) => (
        <div key={monthIndex} className="month">
          <h2>
            {month.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="days">
            {/* ... your existing days of week header ... */}
            {getDaysInMonth(month).map((day, dayIndex) => {
              const dayProjects = getProjectsForDay(day);
              const hasProjects = dayProjects.length > 0;

              return (
                <div
                  key={dayIndex}
                  className={`day ${hasProjects ? "has-projects" : ""}`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="day-number">{day.getDate()}</span>
                  {dayProjects.map((project, index) => (
                    <div
                      key={index}
                      className="project-indicator"
                      style={{ backgroundColor: project.color }}
                    />
                  ))}
                  {selectedDay &&
                    selectedDay.getTime() === day.getTime() &&
                    hasProjects && (
                      <div className="project-popup">
                        {dayProjects.map((project, index) => (
                          <div key={index} className="project-popup-item">
                            <span
                              className="project-color-dot"
                              style={{ backgroundColor: project.color }}
                            />
                            {project.name}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Calendar;

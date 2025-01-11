import { useState, useEffect } from "react";
import "./Calendar.css";

function Calendar({ projects }) {
  const [months, setMonths] = useState([]);

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
            <div className="day-header">Sun</div>
            <div className="day-header">Mon</div>
            <div className="day-header">Tue</div>
            <div className="day-header">Wed</div>
            <div className="day-header">Thu</div>
            <div className="day-header">Fri</div>
            <div className="day-header">Sat</div>
            {Array.from(
              {
                length: new Date(
                  month.getFullYear(),
                  month.getMonth() + 1,
                  0
                ).getDate(),
              },
              (_, i) => {
                const day = new Date(
                  month.getFullYear(),
                  month.getMonth(),
                  i + 1
                );
                const dayProjects = projects.filter((project) => {
                  const startDate = new Date(project.startDate);
                  const endDate = new Date(project.endDate);
                  return day >= startDate && day <= endDate;
                });

                return (
                  <div
                    key={i}
                    className={`day ${
                      dayProjects.length > 0 ? "has-projects" : ""
                    }`}
                    style={{
                      gridColumnStart: i === 0 ? day.getDay() + 1 : "auto",
                    }}
                  >
                    <span className="day-number">{i + 1}</span>
                    {dayProjects.map((project, index) => (
                      <div
                        key={index}
                        className="project-indicator"
                        style={{ backgroundColor: project.color }}
                        title={project.name}
                      />
                    ))}
                  </div>
                );
              }
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Calendar;

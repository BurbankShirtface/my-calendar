import { useState, useEffect } from "react";
import "./Calendar.css";

function Calendar({ projects }) {
  const [months, setMonths] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const getNext12Months = () => {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push(month);
    }

    return months;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      daysInMonth.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push(new Date(year, month, day));
    }

    return daysInMonth;
  };

  const handleDayClick = (date) => {
    if (!date) return;
    if (selectedDay && selectedDay.getTime() === date.getTime()) {
      setSelectedDay(null);
    } else {
      setSelectedDay(date);
    }
  };

  const getProjectsForDay = (date) => {
    if (!date) return [];
    return projects.filter((project) => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  // Update months at midnight
  useEffect(() => {
    const updateMonths = () => {
      setMonths(getNext12Months());
    };

    updateMonths();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    const timeout = setTimeout(() => {
      updateMonths();
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
            {getDaysInMonth(month).map((day, dayIndex) => {
              const dayProjects = getProjectsForDay(day);
              const hasProjects = dayProjects.length > 0;

              return (
                <div
                  key={dayIndex}
                  className={`day ${!day ? "empty" : ""} ${
                    hasProjects ? "has-projects" : ""
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <>
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
                    </>
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

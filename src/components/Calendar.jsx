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

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      // Format the current date string to match the database format (YYYY-MM-DD)
      const currentDateStr = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;

      // Find all projects for this date using string comparison
      const bookedProjects = projects.filter((project) => {
        // Direct string comparison since dates are in YYYY-MM-DD format
        return (
          currentDateStr >= project.startDate &&
          currentDateStr <= project.endDate
        );
      });

      const isToday =
        today.getDate() === i &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      let style = {};

      if (bookedProjects.length > 0) {
        if (bookedProjects.length === 1) {
          style = {
            backgroundColor: bookedProjects[0].color,
            color: getContrastColor(bookedProjects[0].color),
          };
        } else {
          const gradient = bookedProjects
            .map((project, index) => {
              const percentage = 100 / bookedProjects.length;
              const start = percentage * index;
              const end = percentage * (index + 1);
              return `${project.color} ${start}%, ${project.color} ${end}%`;
            })
            .join(", ");

          style = {
            background: `linear-gradient(to bottom, ${gradient})`,
            color: getContrastColor(bookedProjects[0].color),
          };
        }
      }

      const projectNames = bookedProjects.map((p) => p.name).join(", ");

      days.push(
        <div
          key={i}
          className={`day ${bookedProjects.length > 0 ? "booked" : ""} ${
            isToday ? "today" : ""
          }`}
          style={style}
          title={projectNames || ""}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  // Helper function to determine text color based on background color
  const getContrastColor = (hexcolor) => {
    // Remove the # if present
    const hex = hexcolor.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black or white based on luminance
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  return (
    <div className="calendar-grid">
      {months.map((date, index) => (
        <div key={index} className="month-calendar">
          <h2 className="month-title">
            {date.toLocaleString("default", { month: "long" })}{" "}
            {date.getFullYear()}
          </h2>
          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="days">{generateCalendarDays(date)}</div>
        </div>
      ))}
    </div>
  );
}

export default Calendar;

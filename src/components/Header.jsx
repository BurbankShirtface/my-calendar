import montgomeryLogo from "../assets/montgomery-logo.png";
import "./Header.css";

function Header({
  onAdminClick,
  isAuthenticated,
  onNewProject,
  onViewProjects,
  onLogout,
}) {
  return (
    <header className="header">
      <a
        href="https://montgomeryconstruction.ca"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={montgomeryLogo}
          alt="Montgomery Construction"
          className="logo"
        />
      </a>
      <div className="button-container">
        {!isAuthenticated ? (
          <button className="admin-button" onClick={onAdminClick}>
            Admin Access
          </button>
        ) : (
          <>
            <button className="admin-button" onClick={onNewProject}>
              New Project
            </button>
            <button className="admin-button" onClick={onViewProjects}>
              View Projects
            </button>
            <button className="admin-button logout-button" onClick={onLogout}>
              Log Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

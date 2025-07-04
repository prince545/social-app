import React, { useContext, useState } from "react";
import { AuthContext } from "../store/user-auth-store";
import "../App.css";

const Navbar = ({ onNav, currentTab }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", icon: "🏠", tab: "Home" },
    { label: "Explore", icon: "🔍", tab: "Explore" },
    { label: "Create", icon: "➕", tab: "Create" },
    { label: "Profile", icon: "👤", tab: "Profile" },
  ];

  return (
    <nav className="navbar-glass">
      <div className="navbar-logo">SocialApp</div>
      <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span>☰</span>
      </button>
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <li key={link.tab}>
            <button
              className={`navbar-link${currentTab === link.tab ? " active" : ""}`}
              onClick={() => {
                setMenuOpen(false);
                onNav && onNav(link.tab);
              }}
            >
              <span className="navbar-icon">{link.icon}</span> {link.label}
            </button>
          </li>
        ))}
        {currentUser ? (
          <li>
            <button className="navbar-link" onClick={logout}>
              <span className="navbar-icon">🚪</span> Logout
            </button>
          </li>
        ) : null}
      </ul>
      {currentUser && (
        <div className="navbar-user">
          <span className="navbar-avatar">{currentUser.username[0].toUpperCase()}</span>
          <span className="navbar-username">{currentUser.username}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 
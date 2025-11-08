// import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../stylesheets/Header.css';

// type HeaderProps = {
//   links: typeof Link[]
// };

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setDropdownOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  return (
    <header id="site-header">
      <section className="links">
        <div className="link-wrapper">
          <Link to="/home">Home</Link>
        </div>
      </section>

      <search>
        <input placeholder="Search Events" />
      </search>

      {user && (
        <div className="profile-menu">
          {/* Profile icon (blank circle for now) */}
          <div className="profile-icon" onClick={toggleDropdown}>
            {/* Could replace with an <img> later */}
            <div className="circle" />
          </div>

          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={() => { navigate(`/profile/${user._id}`); setDropdownOpen(false); }}>
                Profile
              </button>
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}



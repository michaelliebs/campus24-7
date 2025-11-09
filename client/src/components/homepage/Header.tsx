// import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from "react-icons/fa";
import '../../stylesheets/Header.css';

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
          <Link to="/home">campus24/7</Link>
        </div>
      </section>

      <search id='search-bar'>
        <input placeholder="Search Events" />
      </search>

      {user && (<>
        <Link to="/create-event" style={{textDecoration: "none"}}>
          <button className='create-event-btn'>
            <span style={{fontSize: "22px", marginRight: "10px"}}>+</span>
            Create event
          </button>
        </Link>

       <div className="profile-menu">
          {/* Profile icon */}
          <div className="profile-icon" onClick={toggleDropdown}>
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.name}'s avatar`}
                className="avatar-image"
              />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
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
      </>)}
    </header>
  );
}



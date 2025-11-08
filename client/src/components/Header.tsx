// import React, { useState } from "react";
import { Link } from 'react-router-dom'; 
import '../stylesheets/Header.css';

// type HeaderProps = {
//   links: typeof Link[]
// };

export default function Header() {
  return (
    <header id='site-header'>
      <div className="link-wrapper">
        <Link to="/home">Home</Link>
      </div>
      <div className="link-wrapper">
        <Link to="/account">Account</Link>
      </div>
    </header>
  );
}



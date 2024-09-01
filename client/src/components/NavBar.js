import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css'; // Import CSS file for styling

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEditorPage = location.pathname.startsWith('/editor/') || location.pathname.startsWith('/new');

  return (
    <nav className="navbar">
      {isEditorPage && (
        <button className="back-button" onClick={() => navigate('/')}>
          {'\u2190'} {/* Unicode for left arrow */}
        </button>
      )}
      <h1>Tom - JS Teaching</h1>
    </nav>
  );
}

export default NavBar;

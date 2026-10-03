import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">☀</span>

          <span>
            ADINA
            <small>SOLAR SOLUTIONS</small>
          </span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About Us
          </Link>

          <Link to="/services" onClick={closeMenu}>
            Services
          </Link>

          <Link to="/projects" onClick={closeMenu}>
            Projects
          </Link>

          <Link to="/achievements" onClick={closeMenu}>
            Achievements
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link to="/contact" className="nav-button" onClick={closeMenu}>
            Get a Quote
          </Link>
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

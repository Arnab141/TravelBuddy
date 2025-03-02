import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../AllContext/AllContext';
import LoginSign from '../LoginSign/LoginSign';
import './Navbar.css';
import user_icon from "../../assets/client_image/user_icon.jpeg";

function Navbar() {
  const [activeLink, setActiveLink] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stateLogin, setStateLogin] = useState("Login");
  const { showLoginPopup, setShowLoginPopup, token, setToken, user } = useAppContext();

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <nav className="navbar flex items-center justify-between p-4 bg-blue-500 shadow-md h-16">
      {showLoginPopup && <LoginSign stateLogin={stateLogin} setStateLogin={setStateLogin} />}

      <div className="logo flex items-center">
        <Link to="/">
          <span className="text-white text-xl font-extrabold">TravelBuddy</span>
        </Link>
      </div>

      <div className="nav-links hidden md:flex space-x-4">
        <a href="/" className={`text-white ${activeLink === '/' ? 'active' : ''}`} onClick={() => handleLinkClick('/')}>Home</a>
        <a href="#about" className={`text-white ${activeLink === 'about' ? 'active' : ''}`} onClick={() => handleLinkClick('about')}>About</a>
        <a href="#" className={`text-white ${activeLink === 'services' ? 'active' : ''}`} onClick={() => handleLinkClick('services')}>Services</a>
        <a href="#contact" className={`text-white ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => handleLinkClick('contact')}>Contact</a>
      </div>

      <div className="search-bar hidden md:flex items-center">
        <input type="text" placeholder="Search..." className="p-2 rounded-l-md border border-gray-300" />
        <button className="p-2 bg-white text-blue-500 rounded-r-md border border-gray-300">Search</button>
      </div>

      <div className="flex items-center space-x-4">
        {token ? (
          <div className="relative user-icon">
            <img src={user_icon} alt="User Icon" className="h-8 w-8 rounded-full object-cover" />
            <p>{user.name}</p>
            <div className="dropdown">
              <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
              {/* <Link to="/chat" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Chat</Link> */}
              <Link to="/my-trips" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Trip</Link>
              <p onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 logout_btn">
                Logout
              </p>
            </div>
          </div>
        ) : (
          <div className="auth-buttons hidden md:flex space-x-4">
            <button className="p-2 bg-white text-blue-500 rounded-md" onClick={() => { setStateLogin('Login'); setShowLoginPopup(true); }}>Login</button>
            <button className="p-2 bg-yellow-500 text-white rounded-md" onClick={() => { setStateLogin('Signup'); setShowLoginPopup(true); }}>Get Started</button>
          </div>
        )}

        <div className="md:hidden">
          <button className="text-white" onClick={toggleMenu}>Menu</button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu absolute top-16 left-0 w-full bg-blue-500 text-white flex flex-col items-center space-y-4 py-4 md:hidden">
          <a href="/" className={`text-white ${activeLink === '/' ? 'active' : ''}`} onClick={() => handleLinkClick('/')}>Home</a>
          <a href="#about" className={`text-white ${activeLink === 'about' ? 'active' : ''}`} onClick={() => handleLinkClick('about')}>About</a>
          <a href="#" className={`text-white ${activeLink === 'services' ? 'active' : ''}`} onClick={() => handleLinkClick('services')}>Services</a>
          <a href="#contact" className={`text-white ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => handleLinkClick('contact')}>Contact</a>

          <div className="search-bar flex items-center">
            <input type="text" placeholder="Search..." className="p-2 rounded-l-md border border-gray-300" />
            <button className="p-2 bg-white text-blue-500 rounded-r-md border border-gray-300">Search</button>
          </div>

          {token ? (
            <div className="user-icon">
              <img src={user_icon} alt="User Icon" className="h-10 w-10 rounded-full object-cover" />
            </div>
          ) : (
            <div className="auth-buttons flex space-x-4">
              <button className="p-2 bg-white text-blue-500 rounded-md" onClick={() => { setStateLogin('Login'); setShowLoginPopup(true); }}>Login</button>
              <button className="p-2 bg-yellow-500 text-white rounded-md" onClick={() => { setStateLogin('Signup'); setShowLoginPopup(true); }}>Get Started</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

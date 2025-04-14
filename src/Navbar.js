import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </div>
            <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
                {['Home', 'Competitive Programming', 'Contact'].map((text, index) => {
                    const path = text === 'Home' ? '/' : `/${text.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                        <li key={text} className="nav-item">
                            <NavLink
                                to={path}
                                className="nav-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {text}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navbar;

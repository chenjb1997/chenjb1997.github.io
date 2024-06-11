import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    // State to track which item is hovered
    const [hoverIndex, setHoverIndex] = useState(null);

    const isActiveStyle = (isActive) => ({
        color: isActive ? '#333' : '#666',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderBottom: isActive ? '3px solid #333' : 'none',
        paddingBottom: '2px',
        transition: 'all 0.1s ease'
    });

    return (
        <nav style={styles.navbar}>
            <ul style={styles.navList}>
                {['Home', 'Competitive Programming', 'Publications', 'Contact'].map((text, index) => {
                    const path = `/${text.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                        <li
                            key={text}
                            style={styles.navItem}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <NavLink 
                                to={path}
                                style={({ isActive }) => isActiveStyle(isActive)}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
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

const styles = {
    navbar: {
        backgroundColor: 'white',
        minHeight: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    navList: {
        listStyle: 'none',
        display: 'flex',
        margin: 0,
        padding: 0,
        justifyContent: 'center',  // Ensures the list is centered within the nav
        alignItems: 'center',      // Vertically aligns the links
        width: '100%', 
    },
    navItem: {
        margin: '0 20px',
    }
};

export default Navbar;

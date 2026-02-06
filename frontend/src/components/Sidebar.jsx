import React, { useState } from 'react';
import './Sidebar.css';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { t } = useTranslation();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="sidebar-close-btn" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="sidebar-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-svg-dark">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <circle cx="12" cy="5" r="2" />
                        <path d="M12 7v4" />
                        <line x1="8" y1="16" x2="8" y2="16" />
                        <line x1="16" y1="16" x2="16" y2="16" />
                    </svg>
                    <h2>Breed_Eye</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/" className={`nav-item ${isActive('/')}`} onClick={toggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        {t('sidebar_home')}
                    </Link>
                    <Link to="/cattle" className={`nav-item ${isActive('/cattle')}`} onClick={toggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 21h-2a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z" />
                            <path d="M14 21h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2z" />
                            <path d="M6 13V8a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v5" />
                        </svg>
                        {t('sidebar_cattle')}
                    </Link>
                    <Link to="/buffalo" className={`nav-item ${isActive('/buffalo')}`} onClick={toggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 21a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z" />
                            <circle cx="17" cy="18" r="3" />
                            <path d="M17 15V8a5 5 0 0 0-5-5a5 5 0 0 0-5 5v2" />
                        </svg>
                        {t('sidebar_buffalo')}
                    </Link>
                    <Link to="/about" className={`nav-item ${isActive('/about')}`} onClick={toggleSidebar}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        {t('sidebar_about')}
                    </Link>
                </nav>
            </div>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        </>
    );
};

export default Sidebar;

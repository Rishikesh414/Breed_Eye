import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    // Language options
    const languages = [
        { code: 'en', name: 'English', label: 'English' },
        { code: 'ta', name: 'Tamil', label: 'தமிழ்' },
        { code: 'hi', name: 'Hindi', label: 'हिंदी' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="language-dropdown-container">
            <button
                className="language-selector-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="globe-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>{currentLanguage.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`arrow-icon ${isOpen ? 'open' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="language-dropdown-menu">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            {lang.label}
                        </div>
                    ))}
                </div>
            )}

            {/* Backdrop to close dropdown when clicking outside */}
            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
};

export default LanguageSwitcher;

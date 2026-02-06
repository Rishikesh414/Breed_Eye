import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './BreedPage.css';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="page-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            <header className="page-header">
                <button className="menu-btn dark" onClick={() => setIsSidebarOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <h1>{t('sidebar_about')}</h1>
            </header>

            <main className="page-content">
                <div className="about-content">
                    <h2>Breed_Eye AI</h2>
                    <p>Breed_Eye is a state-of-the-art AI-powered application designed to help farmers, veterinarians, and animal husbandry professionals identify cattle and buffalo breeds instantly.</p>

                    <h3>Key Features</h3>
                    <ul>
                        <li>Instant breed identification using Computer Vision</li>
                        <li>Support for 50 Cattle breeds and 17 Buffalo breeds</li>
                        <li>Offline capability for remote areas</li>
                        <li>Multilingual support (English, Tamil, Hindi)</li>
                    </ul>

                    <h3>Technology</h3>
                    <p>Powered by advanced Deep Learning models trained on thousands of verified images.</p>

                    <p><strong>Note:</strong> Data reference from NBAGR (National Bureau of Animal Genetic Resources).</p>
                </div>
            </main>
        </div>
    );
};

export default About;

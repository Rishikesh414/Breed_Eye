import React, { useState } from 'react';
import { cattleBreeds } from '../data/breeds';
import BreedCard from '../components/BreedCard';
import Sidebar from '../components/Sidebar';
import '../components/BreedCard.css';
import './BreedPage.css';
import { useTranslation } from 'react-i18next';

const Cattle = () => {
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
                <h1>{t('sidebar_cattle')}</h1>
            </header>

            <main className="page-content">
                <div className="breeds-grid">
                    {cattleBreeds.map(breed => (
                        <BreedCard key={breed.id} breed={breed} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Cattle;

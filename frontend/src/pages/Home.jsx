import React, { useState, useRef } from 'react';
import './Home.css';
import OfflineBanner from '../components/OfflineBanner';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Sidebar from '../components/Sidebar';
import CameraCapture from '../components/CameraCapture';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const fileInputRef = useRef(null);

    // Handlers for drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleCapture = (blob) => {
        // Convert blob to file for consistency
        const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
        handleFileSelect(file);
        setIsCameraOpen(false);
    };

    return (
        <div className="home-page">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {/* Header */}
            <header className="main-header">
                <div className="header-left">
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <div className="header-logo">
                        <div className="logo-icon-bg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <circle cx="12" cy="5" r="2" />
                                <path d="M12 7v4" />
                                <line x1="8" y1="16" x2="8" y2="16" />
                                <line x1="16" y1="16" x2="16" y2="16" />
                            </svg>
                            <div className="ai-badge">AI</div>
                        </div>
                        <div className="header-text">
                            <h1>{t('app_title')}</h1>
                            <span>{t('app_subtitle')}</span>
                        </div>
                    </div>
                </div>

                <div className="header-actions">
                    <LanguageSwitcher />
                </div>
            </header>

            {/* Offline Banner */}
            <OfflineBanner />

            {/* Main Content */}
            <main className="main-content">
                <div className="hero-section">
                    <div className="ai-pill">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        {t('ai_powered')}
                    </div>

                    <h2>{t('hero_title')}</h2>
                    <p className="hero-subtitle">{t('hero_subtitle')}</p>
                </div>

                <div className="action-cards">
                    <button className="card action-card capture-card" onClick={() => setIsCameraOpen(true)}>
                        <div className="icon-wrapper green-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                <circle cx="12" cy="13" r="3"></circle>
                            </svg>
                        </div>
                        <h3>{t('capture_btn')}</h3>
                        <span>{t('capture_desc')}</span>
                        <div className="card-decoration green-deco"></div>
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <button className="card action-card upload-card" onClick={triggerFileUpload}>
                        <div className="icon-wrapper orange-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <h3>{t('upload_btn')}</h3>
                        <span>{t('upload_desc')}</span>
                        <div className="card-decoration orange-deco"></div>
                    </button>
                </div>

                <div
                    className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="drop-content">
                        <div className="drop-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                        <h4>{t('drag_drop')}</h4>
                        <span>{t('supported_formats')}</span>
                    </div>
                </div>

                <div className="results-placeholder">
                    {selectedImage ? (
                        <div className="image-preview">
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                            <p style={{ marginTop: '1rem' }}>Image selected: {selectedImage.name || 'Captured Image'}</p>
                        </div>
                    ) : (
                        <>
                            <div className="placeholder-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                    <line x1="9" y1="9" x2="9" y2="9"></line>
                                    <line x1="15" y1="9" x2="15" y2="15"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                                <div className="sparkle-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M12 2L14 7L19 9L14 11L12 16L10 11L5 9L10 7L12 2Z" />
                                    </svg>
                                </div>
                            </div>
                            <h3>{t('no_results')}</h3>
                            <p>{t('no_results_desc')}</p>
                        </>
                    )}
                </div>

            </main>

            {/* Footer */}
            <footer className="main-footer">
                <div className="footer-badges">
                    <span className="badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <rect x="9" y="9" width="6" height="6" />
                            <path d="M9 1v3" />
                            <path d="M15 1v3" />
                            <path d="M9 20v3" />
                            <path d="M15 20v3" />
                            <path d="M20 9h3" />
                            <path d="M20 14h3" />
                            <path d="M1 9h3" />
                            <path d="M1 14h3" />
                        </svg>
                        AI
                    </span>
                    <span className="plus">+</span>
                    <span className="badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M1 12h2.5"></path>
                            <path d="M20.5 12H23"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        Computer Vision
                    </span>
                </div>
                <div className="footer-powered">{t('footer_powered')}</div>

                <div className="reference-box">
                    {t('reference')} <strong>NBAGR</strong> (National Bureau of Animal Genetic Resources)
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </div>

                <div className="copyright">© 2026 Breed_Eye. All rights reserved.</div>
            </footer>

            {isCameraOpen && (
                <CameraCapture
                    onCapture={handleCapture}
                    onCancel={() => setIsCameraOpen(false)}
                />
            )}
        </div>
    );
};

export default Home;

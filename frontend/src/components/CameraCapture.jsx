import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CameraCapture = ({ onCapture, onCancel }) => {
    const { t } = useTranslation();
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                onCapture(blob);
            }, 'image/jpeg');
        }
    };

    return (
        <div className="camera-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'black', zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
            <div style={{ padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{t('camera_title')}</h3>
                <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem' }}>×</button>
            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {error ? (
                    <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        {error}
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
                <div style={{
                    position: 'absolute', bottom: '2rem', left: 0, width: '100%', textAlign: 'center', color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                    {t('camera_instruction')}
                </div>
            </div>

            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', background: 'rgba(0,0,0,0.8)' }}>
                <button onClick={onCancel} style={{ padding: '0.8rem 1.5rem', borderRadius: '50px', border: '1px solid white', background: 'transparent', color: 'white' }}>
                    {t('camera_cancel')}
                </button>
                <button onClick={handleCapture} style={{
                    width: '70px', height: '70px', borderRadius: '50%', background: 'white', border: '4px solid #e5e5e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '90%', height: '90%', borderRadius: '50%', background: '#fff' }}></div>
                </button>
            </div>
        </div>
    );
};

export default CameraCapture;

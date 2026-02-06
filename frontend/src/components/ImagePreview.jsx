import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ImagePreview = ({ imageBlob, onRetake, onUse }) => {
    const { t } = useTranslation();
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (imageBlob) {
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageBlob]);

    if (!imageUrl) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#111827', zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
                />
            </div>

            <div style={{ padding: '2rem', background: 'white', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: 0, color: '#1f2937' }}>{t('preview_question')}</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onRetake}
                        style={{
                            flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid #d1d5db',
                            background: 'white', color: '#4b5563', fontWeight: '600'
                        }}
                    >
                        {t('camera_retake')}
                    </button>
                    <button
                        onClick={onUse}
                        style={{
                            flex: 1, padding: '1rem', borderRadius: '8px', border: 'none',
                            background: '#15803d', color: 'white', fontWeight: '600'
                        }}
                    >
                        {t('preview_use')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImagePreview;

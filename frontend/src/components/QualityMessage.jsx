import React from 'react';
import { useTranslation } from 'react-i18next';

const QualityMessage = ({ issueType, onRetake }) => {
    const { t } = useTranslation();

    const getMessage = () => {
        switch (issueType) {
            case 'blurry': return t('quality_blurry');
            case 'dark': return t('quality_low_light');
            default: return t('quality_blurry');
        }
    };

    return (
        <div style={{
            padding: '1.5rem', background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            maxWidth: '400px', margin: '2rem auto'
        }}>
            <div style={{ fontSize: '2rem' }}>⚠️</div>
            <p style={{ color: '#991b1b', fontWeight: '500', margin: 0 }}>{getMessage()}</p>
            <button
                onClick={onRetake}
                style={{
                    padding: '0.5rem 1rem', background: '#dc2626', color: 'white',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem'
                }}
            >
                {t('quality_retake')}
            </button>
        </div>
    );
};

export default QualityMessage;

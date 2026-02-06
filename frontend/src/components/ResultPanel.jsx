import React from 'react';
import { useTranslation } from 'react-i18next';

const ResultPanel = ({ result, onConfirm, onEdit }) => {
    const { t } = useTranslation();
    const { breedName, confidence, confidenceLevel } = result;

    const getConfidenceColor = (level) => {
        switch (level) {
            case 'High': return '#15803d'; // green
            case 'Medium': return '#d97706'; // orange
            case 'Low': return '#dc2626'; // red
            default: return '#6b7280';
        }
    };

    return (
        <div style={{
            background: 'white', borderRadius: '16px', padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', margin: '0 auto'
        }}>
            <h3 style={{ marginTop: 0, color: '#374151', fontSize: '1.25rem' }}>Identification Result</h3>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                    {breedName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        height: '8px', flex: 1, background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${confidence}%`, height: '100%',
                            background: getConfidenceColor(confidenceLevel),
                            transition: 'width 0.5s ease-out'
                        }}></div>
                    </div>
                    <span style={{ fontWeight: '600', color: getConfidenceColor(confidenceLevel) }}>
                        {confidence}% {t(`confidence_${confidenceLevel.toLowerCase()}`)}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={onEdit}
                    style={{
                        flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', background: 'white',
                        borderRadius: '8px', color: '#4b5563', fontWeight: '500', cursor: 'pointer'
                    }}
                >
                    {t('result_edit')}
                </button>
                <button
                    onClick={onConfirm}
                    style={{
                        flex: 1, padding: '0.75rem', border: 'none', background: '#15803d',
                        borderRadius: '8px', color: 'white', fontWeight: '500', cursor: 'pointer'
                    }}
                >
                    {t('result_confirm')}
                </button>
            </div>
        </div>
    );
};

export default ResultPanel;

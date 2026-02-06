import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const HeatmapViewer = ({ originalImage, heatmapImage }) => {
    const { t } = useTranslation();
    const [showHeatmap, setShowHeatmap] = useState(true);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
                <img
                    src={originalImage}
                    alt="Original"
                    style={{ width: '100%', display: 'block' }}
                />
                {showHeatmap && heatmapImage && (
                    <img
                        src={heatmapImage}
                        alt="Heatmap"
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            opacity: 0.6, mixBlendMode: 'multiply'
                        }}
                    />
                )}
            </div>

            <div style={{
                padding: '1rem', background: 'rgba(0,0,0,0.7)', color: 'white',
                position: 'absolute', bottom: 0, left: 0, width: '100%',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <span style={{ fontSize: '0.9rem' }}>{t('heatmap_caption')}</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={showHeatmap}
                        onChange={(e) => setShowHeatmap(e.target.checked)}
                    />
                    <span style={{ fontSize: '0.8rem' }}>{t('heatmap_toggle')}</span>
                </label>
            </div>
        </div>
    );
};

export default HeatmapViewer;

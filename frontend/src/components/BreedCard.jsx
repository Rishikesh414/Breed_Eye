import React from 'react';
import { Link } from 'react-router-dom';

const BreedCard = ({ breed }) => {
    return (
        <div className="breed-card">
            <div className="breed-image-wrapper">
                <img src={breed.image} alt={breed.name} loading="lazy" />
            </div>
            <div className="breed-info">
                <h3>{breed.name}</h3>
            </div>
        </div>
    );
};

export default BreedCard;

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant d'affichage des cartes du personnel
 * Affiche le nombre de tickets par personne
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.personnelData - Données du personnel
 */
const PersonnelCards = ({ personnelData }) => {
  if (!personnelData || personnelData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Nombre de tickets par personne</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-xl font-semibold mb-4">Nombre de tickets par personne</h2>
      <div className="flex flex-row flex-wrap">
        {personnelData.map((person) => (
          <div 
            key={person.name} 
            className="flex-1 min-w-0 bg-white rounded-lg shadow p-4 m-2 text-center" 
            style={{ borderTop: `4px solid ${person.color}`, minWidth: '200px' }}
          >
            <p className="text-sm text-gray-600">{person.name}</p>
            <p className="text-3xl font-bold" style={{ color: person.color }}>{person.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Validation des propriétés
PersonnelCards.propTypes = {
  personnelData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

export default PersonnelCards;

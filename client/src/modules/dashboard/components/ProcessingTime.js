import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * Composant d'affichage du temps de traitement par technologie
 * Affiche un graphique à barres avec le temps de traitement pour chaque technologie
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.timeData - Données de temps de traitement
 */
const ProcessingTime = ({ timeData }) => {
  // Fonction pour formater le temps en minutes en heures et minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}min`;
  };
  
  if (!timeData || timeData.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Temps de traitement par technologie</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Temps de traitement par technologie</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={timeData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatTime(value)} />
            <Tooltip formatter={(value) => [formatTime(value), 'Temps de traitement']} />
            <Legend />
            <Bar dataKey="value" name="Temps de traitement">
              {timeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Validation des propriétés
ProcessingTime.propTypes = {
  timeData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ProcessingTime;

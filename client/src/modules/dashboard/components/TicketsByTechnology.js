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
 * Composant d'affichage des tickets par technologie
 * Affiche un graphique à barres avec le nombre de tickets pour chaque technologie
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.techData - Données des technologies
 */
const TicketsByTechnology = ({ techData }) => {
  if (!techData || techData.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Tickets par technologie</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tickets par technologie</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={techData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Nombre de tickets">
              {techData.map((entry, index) => (
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
TicketsByTechnology.propTypes = {
  techData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

export default TicketsByTechnology;

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Composant de mise en page pour les onglets du tableau de bord
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.tabs - Liste des onglets disponibles
 * @param {string} props.activeTab - ID de l'onglet actif
 * @param {Function} props.onTabChange - Fonction appelée lors du changement d'onglet
 * @param {React.ReactNode} props.children - Contenu à afficher dans le layout
 */
const TabLayout = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* En-tête avec les onglets */}
      <header className="bg-white shadow">
        <div className="px-4 py-2">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard KPI Sécurité</h1>
        </div>
        
        {/* Navigation par onglets */}
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={`/${tab.id}`}
              className={`py-3 px-6 font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.title}
              {tab.status === 'dev' && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  En développement
                </span>
              )}
            </Link>
          ))}
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-grow p-4">
        {children}
      </main>
      
      {/* Pied de page */}
      <footer className="bg-white shadow-inner py-4 px-6 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} - Dashboard KPI Sécurité</p>
      </footer>
    </div>
  );
};

// Validation des propriétés
TabLayout.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default TabLayout;

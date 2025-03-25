import React from 'react';

/**
 * Composant pour l'onglet Incidents Sécurité (en développement)
 */
const IncidentsTab = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Incidents Sécurité</h2>
        <p className="text-lg text-gray-600 mb-6">
          Ce module est actuellement en développement.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="bg-gray-100 rounded-lg p-4 text-left flex-1 max-w-md">
            <h3 className="font-semibold text-gray-700 mb-2">Fonctionnalités prévues :</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Suivi des incidents de sécurité en temps réel</li>
              <li>Classification par type, gravité et source</li>
              <li>Flux de travail pour la gestion des incidents</li>
              <li>Tableau de bord des tendances et des menaces</li>
              <li>Intégration avec le SIEM et les outils de détection</li>
              <li>Rapports de conformité et d'audit</li>
            </ul>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-left flex-1 max-w-md">
            <h3 className="font-semibold text-gray-700 mb-2">Date de disponibilité estimée :</h3>
            <p className="text-gray-600">T3 2024</p>
            
            <h3 className="font-semibold text-gray-700 mb-2 mt-4">Contact :</h3>
            <p className="text-gray-600">Pour plus d'informations sur ce module, veuillez contacter l'équipe SOC.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentsTab;

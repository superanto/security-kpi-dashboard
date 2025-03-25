import React from 'react';

/**
 * Composant pour l'onglet Tickets Landesk (en développement)
 */
const TicketsTab = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Tickets Landesk</h2>
        <p className="text-lg text-gray-600 mb-6">
          Ce module est actuellement en développement.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="bg-gray-100 rounded-lg p-4 text-left flex-1 max-w-md">
            <h3 className="font-semibold text-gray-700 mb-2">Fonctionnalités prévues :</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Intégration avec Landesk pour la récupération des tickets</li>
              <li>Visualisation des tickets par statut, priorité et catégorie</li>
              <li>Suivi des SLA et des temps de résolution</li>
              <li>Tableau de bord des performances par technicien</li>
              <li>Rapports personnalisables et exportables</li>
            </ul>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-left flex-1 max-w-md">
            <h3 className="font-semibold text-gray-700 mb-2">Date de disponibilité estimée :</h3>
            <p className="text-gray-600">T2 2024</p>
            
            <h3 className="font-semibold text-gray-700 mb-2 mt-4">Contact :</h3>
            <p className="text-gray-600">Pour plus d'informations sur ce module, veuillez contacter l'équipe de développement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsTab;

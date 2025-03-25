import React, { useEffect } from 'react';
import FilterPanel from '../../components/ui/FilterPanel';
import { useDashboard } from '../../contexts/DashboardContext';
import TicketsByTechnology from './components/TicketsByTechnology';
import IncidentsByPerson from './components/IncidentsByPerson';
import ProcessingTime from './components/ProcessingTime';
import SummaryTable from './components/SummaryTable';
import PersonnelCards from './components/PersonnelCards';

/**
 * Composant principal pour l'onglet Dashboard
 * Affiche les filtres et les différentes visualisations
 */
const DashboardTab = () => {
  const { 
    filters, 
    dashboardData, 
    isLoading, 
    error, 
    fetchDashboardData, 
    getDynamicTitle 
  } = useDashboard();
  
  // Charger les données lorsque les filtres changent
  useEffect(() => {
    fetchDashboardData();
  }, [filters, fetchDashboardData]);
  
  // Gérer l'état de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-700">Chargement des données...</p>
      </div>
    );
  }
  
  // Gérer les erreurs
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  // Vérifier si les données sont disponibles
  if (!dashboardData) {
    return (
      <div>
        <FilterPanel />
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Aucune donnée disponible. Veuillez ajuster les filtres et réessayer.</span>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Panneau de filtres */}
      <FilterPanel />
      
      {/* Titre dynamique */}
      <div className="bg-white rounded-lg mb-4 p-4 shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          {getDynamicTitle()}
        </h1>
      </div>
      
      {/* Cartes du personnel */}
      <div className="mb-4">
        <PersonnelCards personnelData={dashboardData.personnel_data} />
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Tickets par technologie */}
        <div className="bg-white rounded-lg p-4 shadow">
          <TicketsByTechnology techData={dashboardData.tech_data} />
        </div>
        
        {/* Incidents par personne */}
        <div className="bg-white rounded-lg p-4 shadow">
          <IncidentsByPerson personnelData={dashboardData.personnel_data} />
        </div>
        
        {/* Temps de traitement */}
        <div className="bg-white rounded-lg p-4 shadow">
          <ProcessingTime timeData={dashboardData.time_data} />
        </div>
        
        {/* Tableau de synthèse */}
        <div className="bg-white rounded-lg p-4 shadow">
          <SummaryTable 
            summaryData={dashboardData.summary_data} 
            trends={dashboardData.trends} 
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;

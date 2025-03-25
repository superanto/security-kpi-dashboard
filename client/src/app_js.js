import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TabLayout from './components/layout/TabLayout';
import { DashboardProvider } from './contexts/DashboardContext';
import { ThemeProvider } from './contexts/ThemeContext';
import useTabManagement from './hooks/useTabManagement';

// Import dynamique des modules
import DashboardTab from './modules/dashboard/DashboardTab';
import TicketsTab from './modules/tickets/TicketsTab';
import IncidentsTab from './modules/incidents/IncidentsTab';

function App() {
  // État pour suivre le chargement de l'application
  const [loading, setLoading] = useState(true);
  
  // Utiliser le hook de gestion des onglets
  const { tabs, activeTab, setActiveTab, isModuleAvailable } = useTabManagement();
  
  // Effet pour simuler le chargement des données initiales
  useEffect(() => {
    // Simuler un temps de chargement (en production, ce serait une requête API réelle)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Afficher un écran de chargement pendant l'initialisation
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ThemeProvider>
      <DashboardProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <TabLayout tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
              <Routes>
                {/* Route par défaut - rediriger vers le dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Routes dynamiques basées sur les modules disponibles */}
                {isModuleAvailable('dashboard') && (
                  <Route path="/dashboard/*" element={<DashboardTab />} />
                )}
                
                {isModuleAvailable('tickets') && (
                  <Route path="/tickets/*" element={<TicketsTab />} />
                )}
                
                {isModuleAvailable('incidents') && (
                  <Route path="/incidents/*" element={<IncidentsTab />} />
                )}
                
                {/* Route pour les pages non trouvées */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-4xl font-bold text-gray-700">404</h1>
                    <p className="text-xl text-gray-600">Page non trouvée</p>
                  </div>
                } />
              </Routes>
            </TabLayout>
          </div>
        </Router>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;

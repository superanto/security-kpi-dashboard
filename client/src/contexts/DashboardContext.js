import React, { createContext, useState, useContext, useCallback } from 'react';

// Création du contexte
const DashboardContext = createContext();

/**
 * Provider pour le contexte du tableau de bord
 * Gère l'état global des filtres et des données
 * 
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 */
export const DashboardProvider = ({ children }) => {
  // État initial des filtres
  const [filters, setFilters] = useState({
    view: 'monthly',            // Type de vue (weekly, monthly, yearly)
    displayType: 'total',       // Type d'affichage (total, average)
    selectedWeek: 1,            // Semaine sélectionnée (1-4)
    selectedMonth: new Date().getMonth() + 1,  // Mois actuel (1-12)
    selectedYear: new Date().getFullYear()     // Année actuelle
  });
  
  // État pour les données
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Met à jour un filtre spécifique
   * 
   * @param {string} filterName - Nom du filtre à mettre à jour
   * @param {any} value - Nouvelle valeur du filtre
   */
  const updateFilter = useCallback((filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  }, []);
  
  /**
   * Récupère les données du tableau de bord depuis l'API
   * en fonction des filtres actuels
   */
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construire les paramètres de requête à partir des filtres
      const params = new URLSearchParams({
        view_type: filters.view,
        display_type: filters.displayType,
        week: filters.selectedWeek,
        month: filters.selectedMonth,
        year: filters.selectedYear
      });
      
      // Appel à l'API
      const response = await fetch(`/api/dashboard/data?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError(err.message || 'Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);
  
  /**
   * Fonction pour obtenir le titre dynamique en fonction des filtres
   * 
   * @returns {string} - Titre formaté
   */
  const getDynamicTitle = useCallback(() => {
    const { view, displayType, selectedWeek, selectedMonth, selectedYear } = filters;
    
    // Obtenir le nom du mois
    const getMonthName = (monthIndex) => {
      const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      return months[monthIndex - 1];
    };
    
    // Construire le titre en fonction du type de vue
    let periodTitle = '';
    if (view === 'weekly') {
      periodTitle = `Semaine ${selectedWeek} de ${getMonthName(selectedMonth)} ${selectedYear}`;
    } else if (view === 'monthly') {
      periodTitle = `${getMonthName(selectedMonth)} ${selectedYear}`;
    } else {
      periodTitle = `Année ${selectedYear}`;
    }
    
    // Préfixe selon le type d'affichage
    const typePrefix = displayType === 'total' ? 'Total' : 'Moyenne';
    
    return `Dashboard KPI Sécurité - ${typePrefix} - ${periodTitle}`;
  }, [filters]);
  
  // Valeur du contexte
  const contextValue = {
    filters,
    updateFilter,
    dashboardData,
    isLoading,
    error,
    fetchDashboardData,
    getDynamicTitle
  };
  
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte du tableau de bord
 * 
 * @returns {Object} - Valeur du contexte
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard doit être utilisé à l\'intérieur d\'un DashboardProvider');
  }
  
  return context;
};

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personnalisé pour gérer les onglets du tableau de bord
 * 
 * @returns {Object} - Fonctions et données pour la gestion des onglets
 */
const useTabManagement = () => {
  // Définir la structure des onglets disponibles (en dur pour l'instant)
  // En production, cette liste serait récupérée depuis l'API
  const defaultTabs = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      status: 'active',
      enabled: true
    },
    {
      id: 'tickets',
      title: 'Ticket Landesk',
      status: 'dev',
      enabled: true
    },
    {
      id: 'incidents',
      title: 'Incidents Sécurité',
      status: 'dev',
      enabled: true
    }
  ];
  
  // État pour stocker les onglets disponibles
  const [tabs, setTabs] = useState(defaultTabs);
  
  // Récupérer l'onglet actif à partir du chemin d'URL
  const location = useLocation();
  
  // Extraire l'ID de l'onglet actif de l'URL (ex: /dashboard -> dashboard)
  const getActiveTabFromURL = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path;
  };
  
  // État pour suivre l'onglet actuellement actif
  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());
  
  // Mettre à jour l'onglet actif lorsque l'URL change
  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location]);
  
  // En production, cette fonction récupérerait les onglets disponibles depuis l'API
  useEffect(() => {
    // Simuler une requête API qui récupérerait les onglets disponibles
    const fetchModules = async () => {
      try {
        // En production, ce serait un appel à l'API réelle
        // const response = await fetch('/api/modules');
        // const data = await response.json();
        
        // Pour l'instant, on utilise les onglets par défaut
        // setTabs(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des modules:', error);
      }
    };
    
    fetchModules();
  }, []);
  
  /**
   * Vérifie si un module est disponible et activé
   * 
   * @param {string} moduleId - Identifiant du module à vérifier
   * @returns {boolean} - true si le module est disponible, false sinon
   */
  const isModuleAvailable = (moduleId) => {
    const tab = tabs.find(t => t.id === moduleId);
    return tab && tab.enabled;
  };
  
  /**
   * Filtre les onglets désactivés
   * 
   * @returns {Array} - Liste des onglets activés
   */
  const getEnabledTabs = () => {
    return tabs.filter(tab => tab.enabled);
  };
  
  return {
    tabs: getEnabledTabs(),
    allTabs: tabs,
    activeTab,
    setActiveTab,
    isModuleAvailable
  };
};

export default useTabManagement;

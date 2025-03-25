import React, { createContext, useState, useContext, useEffect } from 'react';

// Création du contexte
const ThemeContext = createContext();

/**
 * Provider pour le contexte du thème
 * Gère le thème de l'application (clair/sombre)
 * 
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 */
export const ThemeProvider = ({ children }) => {
  // Vérifier si le thème sombre est préféré par le système
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Récupérer le thème enregistré dans localStorage ou utiliser la préférence système
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : prefersDarkMode;
  });
  
  // Mettre à jour le thème dans le DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Écouter les changements de préférence de thème du système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Ne changer que si l'utilisateur n'a pas explicitement choisi un thème
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Nettoyage
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Valeur du contexte
  const contextValue = {
    darkMode,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte du thème
 * 
 * @returns {Object} - Valeur du contexte
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  
  return context;
};

/**
 * Utilitaire pour charger dynamiquement les modules du tableau de bord
 */

// Fonction pour récupérer la liste des modules disponibles depuis l'API
export const fetchAvailableModules = async () => {
  try {
    const response = await fetch('/api/modules');
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const modules = await response.json();
    return modules;
  } catch (error) {
    console.error('Erreur lors du chargement des modules:', error);
    return [];
  }
};

// Fonction pour importer dynamiquement un module par son identifiant
export const importModule = async (moduleId) => {
  try {
    // En utilisant l'import dynamique de webpack/ES6
    const module = await import(`../modules/${moduleId}/${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}Tab.jsx`);
    return module.default; // Récupérer le composant exporté par défaut
  } catch (error) {
    console.error(`Erreur lors de l'importation du module ${moduleId}:`, error);
    return null;
  }
};

// Fonction pour créer un composant de secours en cas d'échec du chargement d'un module
export const createFallbackComponent = (moduleId) => {
  return () => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Erreur!</strong>
      <span className="block sm:inline"> Impossible de charger le module {moduleId}.</span>
    </div>
  );
};

// Fonction utilitaire pour convertir un nom de module en titre lisible
export const formatModuleTitle = (moduleId) => {
  // Convertir les tirets et underscores en espaces
  const withSpaces = moduleId.replace(/[-_]/g, ' ');
  
  // Mettre en majuscule la première lettre de chaque mot
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

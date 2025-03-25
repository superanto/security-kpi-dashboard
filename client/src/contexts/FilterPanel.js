import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';

/**
 * Composant de panneau de filtres pour le tableau de bord
 * Permet de sélectionner la vue, le type d'affichage, la semaine, le mois et l'année
 */
const FilterPanel = () => {
  const { filters, updateFilter } = useDashboard();
  const { view, displayType, selectedWeek, selectedMonth, selectedYear } = filters;
  
  // Fonction pour obtenir le nom du mois
  const getMonthName = (monthIndex) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthIndex - 1];
  };
  
  // Handler pour les changements de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Convertir les valeurs numériques
    let parsedValue = value;
    if (['selectedWeek', 'selectedMonth', 'selectedYear'].includes(name)) {
      parsedValue = parseInt(value, 10);
    }
    
    updateFilter(name, parsedValue);
  };
  
  return (
    <div className="bg-white rounded-lg mb-4 p-4 shadow">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sélecteur de vue */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Vue</label>
          <select
            name="view"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={view}
            onChange={handleFilterChange}
          >
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
            <option value="yearly">Annuelle</option>
          </select>
        </div>
        
        {/* Sélecteur de type d'affichage */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Affichage</label>
          <select
            name="displayType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={displayType}
            onChange={handleFilterChange}
          >
            <option value="total">Total</option>
            <option value="average">Moyenne</option>
          </select>
        </div>
        
        {/* Sélecteur de semaine (affiché uniquement en vue hebdomadaire) */}
        {view === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Semaine</label>
            <select
              name="selectedWeek"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedWeek}
              onChange={handleFilterChange}
            >
              {[1, 2, 3, 4].map(week => (
                <option key={week} value={week}>Semaine {week}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Sélecteur de mois (affiché sauf en vue annuelle) */}
        {view !== 'yearly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Mois</label>
            <select
              name="selectedMonth"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedMonth}
              onChange={handleFilterChange}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{getMonthName(month)}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Sélecteur d'année */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Année</label>
          <select
            name="selectedYear"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedYear}
            onChange={handleFilterChange}
          >
            {[2022, 2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

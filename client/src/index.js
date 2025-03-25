import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Importation du fichier CSS de Tailwind
import './tailwind.css';

// Point d'entrée de l'application
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Si vous voulez commencer à mesurer les performances de votre application,
// passez une fonction pour journaliser les résultats (par exemple: reportWebVitals(console.log))
// ou envoyez-les à un point d'analyse.
// En savoir plus: https://bit.ly/CRA-vitals
reportWebVitals();

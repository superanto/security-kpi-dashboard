# Structure du Projet Dashboard KPI Sécurité

```
security-kpi-dashboard/
│
├── server/                         # Serveur backend
│   ├── app.py                      # Point d'entrée principal de l'application
│   ├── config/                     # Configuration du serveur
│   │   ├── __init__.py
│   │   ├── settings.py             # Paramètres généraux
│   │   └── ssl/                    # Certificats SSL pour HTTPS
│   │       ├── generate_cert.sh    # Script pour générer des certificats auto-signés
│   │       ├── cert.pem            # Certificat (à générer)
│   │       └── key.pem             # Clé privée (à générer)
│   │
│   ├── connectors/                 # Connecteurs pour les sources de données
│   │   ├── __init__.py             # Chargement dynamique des connecteurs
│   │   ├── base_connector.py       # Classe de base pour les connecteurs
│   │   ├── sql_connector.py        # Connecteur SQL
│   │   └── api_connector.py        # Connecteur API REST
│   │
│   └── modules/                    # Gestion des modules
│       ├── __init__.py             # Découverte automatique des modules
│       └── module_registry.py      # Registre central des modules
│
├── client/                         # Frontend React
│   ├── public/                     # Fichiers statiques publics
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/                        # Code source React
│       ├── index.js                # Point d'entrée React
│       ├── App.js                  # Composant principal
│       ├── setupProxy.js           # Configuration du proxy pour le développement
│       │
│       ├── components/             # Composants réutilisables
│       │   ├── layout/             # Composants de mise en page
│       │   │   ├── TabLayout.jsx   # Gestionnaire d'onglets dynamiques
│       │   │   └── ContentPanel.jsx # Panneau de contenu principal
│       │   │
│       │   └── ui/                 # Composants d'interface utilisateur
│       │       ├── TimeFormatters.jsx # Formatage du temps
│       │       ├── FilterPanel.jsx   # Panneau de filtres
│       │       └── StatCard.jsx      # Carte de statistiques
│       │
│       ├── hooks/                  # Hooks personnalisés
│       │   ├── useDataFetching.js  # Hook pour récupérer les données
│       │   └── useTabManagement.js # Hook pour gérer les onglets
│       │
│       ├── contexts/               # Contextes React
│       │   ├── DashboardContext.jsx # Contexte des données du dashboard
│       │   └── ThemeContext.jsx    # Contexte de thème
│       │
│       ├── utils/                  # Utilitaires
│       │   ├── dateUtils.js        # Fonctions de manipulation de dates
│       │   ├── formatters.js       # Formateurs de données
│       │   └── moduleLoader.js     # Chargement dynamique des modules
│       │
│       └── modules/                # Modules (onglets) du dashboard
│           ├── index.js            # Export automatique des modules
│           │
│           ├── dashboard/          # Module Dashboard principal
│           │   ├── DashboardTab.jsx # Composant principal du module Dashboard
│           │   ├── components/      # Composants spécifiques au Dashboard
│           │   │   ├── TicketsByTechnology.jsx
│           │   │   ├── IncidentsByPerson.jsx
│           │   │   ├── ProcessingTime.jsx
│           │   │   └── SummaryTable.jsx
│           │   └── hooks/          # Hooks spécifiques au Dashboard
│           │       └── useDashboardData.js
│           │
│           ├── tickets/            # Module Tickets Landesk (en développement)
│           │   └── TicketsTab.jsx  # Composant principal du module Tickets
│           │
│           └── incidents/          # Module Incidents Sécurité (en développement)
│               └── IncidentsTab.jsx # Composant principal du module Incidents
│
├── package.json                    # Dépendances npm et scripts
├── tailwind.config.js              # Configuration Tailwind CSS
└── README.md                       # Documentation du projet
```

Cette structure offre une organisation modulaire qui permettra :
1. D'ajouter facilement de nouveaux onglets en créant un nouveau dossier dans `client/src/modules/`
2. La découverte automatique des modules grâce au système de chargement dynamique
3. L'intégration future de connecteurs SQL et API
4. La configuration HTTPS pour la sécurité

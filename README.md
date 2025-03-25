# Dashboard KPI Sécurité

## Description
Un tableau de bord modulaire pour visualiser les KPI de sécurité, développé avec React, Tailwind CSS et Flask.

## Fonctionnalités
- Structure modulaire permettant l'ajout facile de nouveaux onglets
- Interface responsive avec Tailwind CSS
- Visualisations interactives avec Recharts
- Backend Python avec Flask supportant HTTPS
- Connecteurs pour l'intégration future avec SQL et API

## Structure du projet
Le projet est organisé avec une architecture modulaire :

```
security-kpi-dashboard/
│
├── server/                         # Serveur backend Flask
│   ├── app.py                      # Point d'entrée principal
│   ├── config/                     # Configuration du serveur
│   ├── connectors/                 # Connecteurs pour les sources de données
│   └── modules/                    # Modules backend (découverte automatique)
│
├── client/                         # Frontend React
    ├── public/                     # Fichiers statiques
    └── src/                        # Code source React
        ├── components/             # Composants réutilisables
        ├── contexts/               # Contextes React
        ├── hooks/                  # Hooks personnalisés
        ├── modules/                # Modules (onglets) du dashboard
        └── utils/                  # Utilitaires
```

## Prérequis
- Python 3.6.8 ou supérieur
- Node.js 14 ou supérieur
- npm ou yarn

## Installation

### Backend (serveur Flask)
1. Créer un environnement virtuel Python :
   ```
   python -m venv venv
   source venv/bin/activate  # Sur Windows : venv\Scripts\activate
   ```

2. Installer les dépendances :
   ```
   pip install -r requirements.txt
   ```

3. Générer des certificats SSL pour le développement (optionnel) :
   ```
   cd server/config/ssl
   chmod +x generate_cert.sh
   ./generate_cert.sh
   ```

4. Démarrer le serveur :
   ```
   cd server
   python app.py
   ```

### Frontend (client React)
1. Installer les dépendances :
   ```
   cd client
   npm install
   ```

2. Démarrer le serveur de développement :
   ```
   npm start
   ```

## Ajout d'un nouveau module (onglet)
1. Créer un nouveau dossier dans `client/src/modules/` avec le nom du module
2. Créer un composant principal pour l'onglet (par exemple `NewModuleTab.jsx`)
3. Créer un dossier dans `server/modules/` avec le même nom
4. Ajouter un fichier `__init__.py` avec les routes API nécessaires

Le système découvrira automatiquement le nouveau module et l'ajoutera à l'interface.

## Configuration HTTPS
Par défaut, le serveur utilise HTTPS sur le port 5001. Pour configurer les certificats en production :

1. Remplacer les fichiers `cert.pem` et `key.pem` dans `server/config/ssl/` par des certificats signés par une autorité de certification
2. Redémarrer le serveur

## Connecteurs pour les sources de données
Le système prend en charge deux types de connecteurs :

- **SQLConnector** : Pour les bases de données SQL
- **APIConnector** : Pour les API REST

Pour utiliser un connecteur, consultez les exemples dans le dossier `server/connectors/`.

## Licence
Ce projet est sous licence [MIT](LICENSE).

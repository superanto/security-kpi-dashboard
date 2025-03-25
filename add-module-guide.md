# Guide d'ajout d'un nouveau module

Ce document explique comment ajouter facilement un nouveau module (onglet) au tableau de bord KPI Sécurité.

## Aperçu

L'architecture du projet est conçue pour être modulaire et extensible. Pour ajouter un nouveau module, vous devez créer :

1. Un module frontend (composant React)
2. Un module backend (API Flask)

Le système détectera automatiquement votre nouveau module et l'intégrera à l'interface sans avoir à modifier le code existant.

## Exemple : Ajouter un module "Assets" pour le suivi des actifs

### 1. Créer le module frontend

#### 1.1. Créer la structure de dossiers

```
client/src/modules/assets/
├── AssetsTab.jsx              # Composant principal de l'onglet
├── components/                # Composants spécifiques au module
│   ├── AssetsList.jsx
│   ├── AssetDetails.jsx
│   └── AssetsStats.jsx
└── hooks/                     # Hooks spécifiques au module
    └── useAssetsData.js
```

#### 1.2. Créer le composant principal de l'onglet

Fichier: `client/src/modules/assets/AssetsTab.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import AssetsList from './components/AssetsList';
import AssetDetails from './components/AssetDetails';
import AssetsStats from './components/AssetsStats';

const AssetsTab = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les données des actifs depuis l'API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/assets/list');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssets();
  }, []);
  
  // Gérer l'état de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-700">Chargement des actifs...</p>
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
  
  return (
    <div>
      <div className="bg-white rounded-lg mb-4 p-4 shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Actifs
        </h1>
      </div>
      
      {/* Statistiques des actifs */}
      <div className="bg-white rounded-lg mb-4 p-4 shadow">
        <AssetsStats assets={assets} />
      </div>
      
      {/* Liste des actifs et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white rounded-lg p-4 shadow">
          <AssetsList assets={assets} />
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow">
          <AssetDetails />
        </div>
      </div>
    </div>
  );
};

export default AssetsTab;
```

### 2. Créer le module backend

#### 2.1. Créer la structure de dossiers

```
server/modules/assets/
├── __init__.py               # Point d'entrée du module
└── models.py                 # Modèles de données (optionnel)
```

#### 2.2. Créer le point d'entrée du module

Fichier: `server/modules/assets/__init__.py`

```python
# Module Assets - Gestion des actifs de sécurité
import logging
from flask import Blueprint, jsonify, request

logger = logging.getLogger(__name__)

# Création du Blueprint pour les routes du module
assets_bp = Blueprint('assets', __name__, url_prefix='/api/assets')

def get_module_info():
    """
    Retourne les informations sur ce module pour l'enregistrement
    
    Returns:
        dict: Informations sur le module
    """
    return {
        "name": "assets",
        "title": "Gestion des Actifs",
        "description": "Suivi et gestion des actifs de sécurité",
        "enabled": True,
        "icon": "computer",
        "order": 3  # Position dans les onglets (après Dashboard et Tickets)
    }

# Données fictives pour les actifs
MOCK_ASSETS = [
    {
        "id": 1,
        "name": "Firewall Principal",
        "type": "Firewall",
        "vendor": "Cisco",
        "model": "ASA 5500-X",
        "status": "Active",
        "last_update": "2024-01-15"
    },
    {
        "id": 2,
        "name": "Serveur SIEM",
        "type": "Server",
        "vendor": "IBM",
        "model": "QRadar",
        "status": "Active",
        "last_update": "2024-02-20"
    },
    # Ajouter d'autres exemples d'actifs...
]

# Route pour récupérer la liste des actifs
@assets_bp.route('/list', methods=['GET'])
def get_assets_list():
    """
    Endpoint pour récupérer la liste des actifs
    
    Returns:
        JSON: Liste des actifs
    """
    return jsonify(MOCK_ASSETS)

# Route pour récupérer les détails d'un actif spécifique
@assets_bp.route('/<int:asset_id>', methods=['GET'])
def get_asset_details(asset_id):
    """
    Endpoint pour récupérer les détails d'un actif
    
    Args:
        asset_id (int): ID de l'actif
        
    Returns:
        JSON: Détails de l'actif
    """
    asset = next((a for a in MOCK_ASSETS if a["id"] == asset_id), None)
    
    if not asset:
        return jsonify({"error": "Actif non trouvé"}), 404
        
    return jsonify(asset)

# Fonction pour enregistrer les routes du module
def register_routes(app):
    """
    Enregistre les routes du module dans l'application
    
    Args:
        app (Flask): Application Flask
    """
    app.register_blueprint(assets_bp)
    logger.info("Routes du module assets enregistrées")
```

### 3. Vérifier que tout fonctionne

1. Redémarrez le serveur Flask
2. Actualisez l'application frontend

Votre nouveau module "Gestion des Actifs" devrait apparaître automatiquement dans la barre d'onglets et être entièrement fonctionnel.

## Résumé des étapes pour ajouter un module

1. **Frontend** :
   - Créer un dossier dans `client/src/modules/` avec le nom du module
   - Créer un composant principal nommé `[ModuleName]Tab.jsx`
   - Ajouter les composants spécifiques dans un sous-dossier `components/`

2. **Backend** :
   - Créer un dossier dans `server/modules/` avec le même nom
   - Créer un fichier `__init__.py` avec :
     - Une fonction `get_module_info()` qui renvoie les métadonnées du module
     - Un Blueprint Flask pour les routes API
     - Une fonction `register_routes(app)` pour enregistrer les routes

3. **Redémarrer** les serveurs pour que les modifications prennent effet.

Le système se charge du reste grâce à la découverte automatique des modules !

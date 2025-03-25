# settings.py - Paramètres de configuration du serveur
import os

# Configuration du serveur
SERVER_CONFIG = {
    'HOST': '0.0.0.0',  # Écouter sur toutes les interfaces
    'PORT': 5001,       # Port spécifié dans les exigences
    'DEBUG': False,     # Désactivé en production
    'ENABLE_HTTPS': True,  # Activer HTTPS
}

# Configuration des connecteurs de données
DATABASE_CONFIG = {
    'SQL': {
        'ENGINE': 'sqlite',  # sqlite, mysql, postgresql
        'NAME': os.path.join(os.path.dirname(__file__), '..', 'data', 'security_kpi.db'),
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    },
    'API': {
        'BASE_URL': '',
        'AUTH_TOKEN': '',
        'TIMEOUT': 10,  # secondes
    }
}

# Paramètres de l'application
APP_CONFIG = {
    'CACHE_TIMEOUT': 300,  # Durée du cache en secondes (5 minutes)
    'MODULES_ENABLED': True,  # Activer la découverte automatique des modules
    'LOG_LEVEL': 'INFO',  # DEBUG, INFO, WARNING, ERROR, CRITICAL
}

# Chemins importants
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODULES_DIR = os.path.join(BASE_DIR, 'modules')

# Créer les répertoires nécessaires s'ils n'existent pas
for dir_path in [STATIC_DIR, DATA_DIR]:
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

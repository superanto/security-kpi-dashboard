# app.py - Point d'entrée principal du serveur
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os
import importlib
import pkgutil
import logging
from config.settings import SERVER_CONFIG

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='../client/build')
CORS(app)  # Active CORS pour le développement

# Enregistrement dynamique des modules
def register_modules():
    """Charge dynamiquement tous les modules disponibles dans le dossier modules"""
    logger.info("Chargement des modules...")
    modules_package = 'modules'
    
    try:
        modules_package_obj = importlib.import_module(modules_package)
        modules_path = modules_package_obj.__path__
        
        for _, module_name, is_pkg in pkgutil.iter_modules(modules_path):
            if is_pkg:  # Assure que c'est un package (dossier avec __init__.py)
                try:
                    module = importlib.import_module(f'{modules_package}.{module_name}')
                    if hasattr(module, 'register_routes'):
                        logger.info(f"Enregistrement du module: {module_name}")
                        module.register_routes(app)
                    else:
                        logger.warning(f"Module {module_name} n'a pas de fonction register_routes")
                except Exception as e:
                    logger.error(f"Erreur lors du chargement du module {module_name}: {str(e)}")
    except ImportError as e:
        logger.error(f"Erreur d'importation pour {modules_package}: {str(e)}")
    except Exception as e:
        logger.error(f"Erreur inattendue lors du chargement des modules: {str(e)}")

# Endpoint pour la liste des modules disponibles
@app.route('/api/modules', methods=['GET'])
def get_modules():
    """Renvoie la liste des modules disponibles pour le frontend"""
    from modules import module_registry
    return jsonify(module_registry.get_modules_info())

# Servir le frontend React en production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Point d'entrée principal
if __name__ == '__main__':
    register_modules()
    
    # Configuration SSL pour HTTPS
    ssl_context = None
    if SERVER_CONFIG.get('ENABLE_HTTPS', True):
        cert_path = os.path.join('config', 'ssl', 'cert.pem')
        key_path = os.path.join('config', 'ssl', 'key.pem')
        
        if os.path.exists(cert_path) and os.path.exists(key_path):
            ssl_context = (cert_path, key_path)
            logger.info("SSL activé avec les certificats existants")
        else:
            logger.warning("Certificats SSL non trouvés, HTTPS désactivé")
    
    # Démarrage du serveur
    app.run(
        host=SERVER_CONFIG.get('HOST', '0.0.0.0'),
        port=SERVER_CONFIG.get('PORT', 5001),
        ssl_context=ssl_context,
        debug=SERVER_CONFIG.get('DEBUG', False)
    )

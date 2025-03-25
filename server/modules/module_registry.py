# module_registry.py - Registre central pour tous les modules
import logging
import os
import importlib
import pkgutil
import inspect

logger = logging.getLogger(__name__)

class ModuleRegistry:
    """
    Gère l'enregistrement et le suivi de tous les modules disponibles.
    Permet une découverte automatique des modules et leurs fonctionnalités.
    """
    
    def __init__(self):
        """Initialise le registre des modules"""
        self.modules = {}  # Dictionnaire des modules enregistrés {nom: info_module}
        self.initialized = False
    
    def register_module(self, module_name, module_info):
        """
        Enregistre un module dans le registre
        
        Args:
            module_name (str): Nom du module
            module_info (dict): Informations sur le module
        """
        if module_name in self.modules:
            logger.warning(f"Module {module_name} déjà enregistré, mise à jour des informations")
        
        self.modules[module_name] = module_info
        logger.info(f"Module enregistré: {module_name}")
    
    def discover_modules(self):
        """
        Découvre automatiquement tous les modules dans le répertoire 'modules'
        """
        logger.info("Découverte automatique des modules...")
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        for _, module_name, is_pkg in pkgutil.iter_modules([current_dir]):
            if is_pkg and module_name != "__pycache__":  # C'est un package (dossier)
                try:
                    # Importer le module dynamiquement
                    module = importlib.import_module(f"modules.{module_name}")
                    
                    # Vérifier si le module a une fonction get_module_info
                    if hasattr(module, "get_module_info"):
                        module_info = module.get_module_info()
                        self.register_module(module_name, module_info)
                    else:
                        # Créer des informations de base sur le module
                        module_info = {
                            "name": module_name,
                            "title": module_name.capitalize(),
                            "description": f"Module {module_name}",
                            "enabled": True,
                            "icon": "module",
                            "order": 999  # Ordre par défaut
                        }
                        self.register_module(module_name, module_info)
                        
                except Exception as e:
                    logger.error(f"Erreur lors de la découverte du module {module_name}: {str(e)}")
        
        # Trier les modules par ordre
        sorted_modules = sorted(self.modules.items(), key=lambda x: x[1].get("order", 999))
        self.modules = dict(sorted_modules)
        
        self.initialized = True
        logger.info(f"Découverte terminée. {len(self.modules)} modules trouvés.")
    
    def get_modules_info(self):
        """
        Obtient les informations sur tous les modules enregistrés
        
        Returns:
            list: Liste des informations sur les modules
        """
        if not self.initialized:
            self.discover_modules()
            
        # Convertir en liste pour l'API
        modules_list = []
        for module_name, module_info in self.modules.items():
            module_data = module_info.copy()
            module_data["id"] = module_name
            modules_list.append(module_data)
            
        return modules_list
    
    def get_module(self, module_name):
        """
        Obtient les informations sur un module spécifique
        
        Args:
            module_name (str): Nom du module
            
        Returns:
            dict: Informations sur le module ou None s'il n'existe pas
        """
        if not self.initialized:
            self.discover_modules()
            
        return self.modules.get(module_name)
    
    def is_module_enabled(self, module_name):
        """
        Vérifie si un module est activé
        
        Args:
            module_name (str): Nom du module
            
        Returns:
            bool: True si le module est activé, False sinon
        """
        module_info = self.get_module(module_name)
        if not module_info:
            return False
            
        return module_info.get("enabled", False)
    
    def enable_module(self, module_name, enabled=True):
        """
        Active ou désactive un module
        
        Args:
            module_name (str): Nom du module
            enabled (bool): État d'activation
            
        Returns:
            bool: True si l'opération a réussi, False sinon
        """
        if not self.initialized:
            self.discover_modules()
            
        if module_name not in self.modules:
            logger.warning(f"Module {module_name} non trouvé, impossible de modifier son état")
            return False
            
        self.modules[module_name]["enabled"] = enabled
        logger.info(f"Module {module_name} {'activé' if enabled else 'désactivé'}")
        return True

# Créer une instance singleton du registre
module_registry = ModuleRegistry()

# Fonctions pratiques pour interagir avec le registre
def register_module(module_name, module_info):
    """Enregistre un module dans le registre"""
    return module_registry.register_module(module_name, module_info)

def get_modules_info():
    """Obtient les informations sur tous les modules"""
    return module_registry.get_modules_info()

def get_module(module_name):
    """Obtient les informations sur un module spécifique"""
    return module_registry.get_module(module_name)

def is_module_enabled(module_name):
    """Vérifie si un module est activé"""
    return module_registry.is_module_enabled(module_name)

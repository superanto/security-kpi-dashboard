# base_connector.py - Classe de base pour tous les connecteurs de données
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class BaseConnector(ABC):
    """
    Classe abstraite définissant l'interface pour tous les connecteurs de données.
    Tous les connecteurs spécifiques doivent hériter de cette classe et implémenter ses méthodes.
    """
    
    def __init__(self, name, config=None):
        """
        Initialise un nouveau connecteur
        
        Args:
            name (str): Nom identifiant le connecteur
            config (dict, optional): Configuration spécifique au connecteur. Par défaut None.
        """
        self.name = name
        self.config = config or {}
        self.is_connected = False
        logger.info(f"Initialisation du connecteur: {name}")
    
    @abstractmethod
    def connect(self):
        """
        Établit une connexion à la source de données.
        Doit être implémentée par les classes dérivées.
        
        Returns:
            bool: True si la connexion a réussi, False sinon
        """
        pass
    
    @abstractmethod
    def disconnect(self):
        """
        Ferme la connexion à la source de données.
        Doit être implémentée par les classes dérivées.
        
        Returns:
            bool: True si la déconnexion a réussi, False sinon
        """
        pass
    
    @abstractmethod
    def fetch_data(self, query, params=None):
        """
        Récupère des données depuis la source.
        
        Args:
            query (str): Requête ou chemin pour obtenir les données
            params (dict, optional): Paramètres supplémentaires. Par défaut None.
            
        Returns:
            dict: Résultats de la requête
        """
        pass
    
    @abstractmethod
    def test_connection(self):
        """
        Teste si la connexion à la source de données est fonctionnelle.
        
        Returns:
            bool: True si la connexion est fonctionnelle, False sinon
        """
        pass
    
    def get_info(self):
        """
        Renvoie des informations sur le connecteur.
        
        Returns:
            dict: Informations sur le connecteur
        """
        return {
            "name": self.name,
            "type": self.__class__.__name__,
            "is_connected": self.is_connected,
        }

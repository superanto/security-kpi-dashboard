# sql_connector.py - Connecteur pour les bases de données SQL
import logging
import sqlite3
import json
from datetime import datetime
from .base_connector import BaseConnector

logger = logging.getLogger(__name__)

class SQLConnector(BaseConnector):
    """
    Connecteur pour les bases de données SQL.
    Supporte SQLite par défaut, extensible pour d'autres moteurs SQL.
    """
    
    def __init__(self, name, config):
        """
        Initialise un connecteur SQL
        
        Args:
            name (str): Nom du connecteur
            config (dict): Configuration avec les clés :
                - ENGINE: Type de base de données (sqlite, mysql, postgresql)
                - NAME: Nom de la base de données ou chemin du fichier
                - USER: Nom d'utilisateur (facultatif pour sqlite)
                - PASSWORD: Mot de passe (facultatif pour sqlite)
                - HOST: Hôte (facultatif pour sqlite)
                - PORT: Port (facultatif pour sqlite)
        """
        super().__init__(name, config)
        self.connection = None
        self.engine = config.get('ENGINE', 'sqlite').lower()
        self.db_name = config.get('NAME', ':memory:')
        
    def connect(self):
        """
        Établit une connexion à la base de données SQL
        
        Returns:
            bool: True si la connexion a réussi, False sinon
        """
        try:
            if self.engine == 'sqlite':
                self.connection = sqlite3.connect(self.db_name)
                self.connection.row_factory = sqlite3.Row
            else:
                # Implémentation future pour d'autres moteurs de base de données
                logger.error(f"Moteur de base de données non supporté: {self.engine}")
                return False
            
            self.is_connected = True
            logger.info(f"Connexion établie à la base de données {self.db_name}")
            return True
            
        except Exception as e:
            logger.error(f"Erreur de connexion à la base de données: {str(e)}")
            self.is_connected = False
            return False
    
    def disconnect(self):
        """
        Ferme la connexion à la base de données
        
        Returns:
            bool: True si la déconnexion a réussi, False sinon
        """
        if self.connection:
            try:
                self.connection.close()
                self.is_connected = False
                logger.info("Déconnexion de la base de données réussie")
                return True
            except Exception as e:
                logger.error(f"Erreur lors de la déconnexion: {str(e)}")
                return False
        return True
    
    def fetch_data(self, query, params=None):
        """
        Exécute une requête SQL et récupère les résultats
        
        Args:
            query (str): Requête SQL à exécuter
            params (dict, optional): Paramètres pour la requête SQL. Par défaut None.
            
        Returns:
            dict: Résultats de la requête sous forme de dictionnaire
        """
        if not self.is_connected:
            if not self.connect():
                return {"error": "Non connecté à la base de données"}
        
        try:
            cursor = self.connection.cursor()
            start_time = datetime.now()
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            # Récupération des résultats
            columns = [column[0] for column in cursor.description] if cursor.description else []
            results = []
            
            for row in cursor.fetchall():
                # Convertir chaque ligne en dictionnaire
                if isinstance(row, sqlite3.Row):
                    results.append(dict(row))
                else:
                    results.append(dict(zip(columns, row)))
            
            execution_time = (datetime.now() - start_time).total_seconds()
            logger.debug(f"Requête exécutée en {execution_time:.3f}s, {len(results)} résultats")
            
            return {
                "data": results,
                "count": len(results),
                "execution_time": execution_time,
                "columns": columns
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de l'exécution de la requête: {str(e)}")
            return {"error": str(e)}
    
    def test_connection(self):
        """
        Teste si la connexion à la base de données est fonctionnelle
        
        Returns:
            bool: True si la connexion est fonctionnelle, False sinon
        """
        if not self.is_connected:
            return self.connect()
            
        try:
            # Exécute une requête simple pour tester la connexion
            result = self.fetch_data("SELECT 1")
            return "error" not in result
        except Exception:
            return False
    
    def get_info(self):
        """
        Renvoie des informations sur le connecteur
        
        Returns:
            dict: Informations sur le connecteur SQL
        """
        info = super().get_info()
        info.update({
            "engine": self.engine,
            "database": self.db_name
        })
        return info

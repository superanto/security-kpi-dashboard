# api_connector.py - Connecteur pour les API REST
import logging
import requests
import json
from datetime import datetime
from .base_connector import BaseConnector

logger = logging.getLogger(__name__)

class APIConnector(BaseConnector):
    """
    Connecteur pour les API REST.
    Permet de récupérer des données depuis des API externes.
    """
    
    def __init__(self, name, config):
        """
        Initialise un connecteur API
        
        Args:
            name (str): Nom du connecteur
            config (dict): Configuration avec les clés :
                - BASE_URL: URL de base de l'API
                - AUTH_TOKEN: Token d'authentification (optionnel)
                - TIMEOUT: Timeout en secondes (par défaut: 10)
                - HEADERS: En-têtes HTTP supplémentaires (optionnel)
        """
        super().__init__(name, config)
        self.base_url = config.get('BASE_URL', '')
        self.auth_token = config.get('AUTH_TOKEN', '')
        self.timeout = config.get('TIMEOUT', 10)
        self.headers = config.get('HEADERS', {})
        
        # Configuration des en-têtes d'authentification si un token est fourni
        if self.auth_token:
            self.headers['Authorization'] = f"Bearer {self.auth_token}"
            
        self.session = None
    
    def connect(self):
        """
        Crée une session HTTP persistante
        
        Returns:
            bool: True si la session a été créée avec succès, False sinon
        """
        try:
            self.session = requests.Session()
            self.session.headers.update(self.headers)
            self.is_connected = True
            logger.info(f"Session API créée pour {self.base_url}")
            return True
        except Exception as e:
            logger.error(f"Erreur lors de la création de la session API: {str(e)}")
            self.is_connected = False
            return False
    
    def disconnect(self):
        """
        Ferme la session HTTP
        
        Returns:
            bool: True si la session a été fermée avec succès, False sinon
        """
        if self.session:
            try:
                self.session.close()
                self.session = None
                self.is_connected = False
                logger.info("Session API fermée")
                return True
            except Exception as e:
                logger.error(f"Erreur lors de la fermeture de la session API: {str(e)}")
                return False
        return True
    
    def fetch_data(self, endpoint, params=None):
        """
        Récupère des données depuis l'API
        
        Args:
            endpoint (str): Endpoint API à interroger (sera ajouté à l'URL de base)
            params (dict, optional): Paramètres pour la requête API. Par défaut None.
                Peut contenir :
                - method: Méthode HTTP (GET par défaut)
                - data: Données à envoyer pour POST/PUT
                - query_params: Paramètres d'URL (?param=value)
                
        Returns:
            dict: Résultats de la requête API
        """
        if not self.is_connected:
            if not self.connect():
                return {"error": "Non connecté à l'API"}
        
        # Extraire les paramètres spécifiques
        params = params or {}
        method = params.get('method', 'GET').upper()
        data = params.get('data')
        query_params = params.get('query_params')
        
        # Construire l'URL complète
        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        
        try:
            start_time = datetime.now()
            
            # Exécuter la requête avec la méthode appropriée
            if method == 'GET':
                response = self.session.get(url, params=query_params, timeout=self.timeout)
            elif method == 'POST':
                response = self.session.post(url, json=data, params=query_params, timeout=self.timeout)
            elif method == 'PUT':
                response = self.session.put(url, json=data, params=query_params, timeout=self.timeout)
            elif method == 'DELETE':
                response = self.session.delete(url, params=query_params, timeout=self.timeout)
            else:
                return {"error": f"Méthode HTTP non supportée: {method}"}
            
            # Calculer le temps d'exécution
            execution_time = (datetime.now() - start_time).total_seconds()
            
            # Vérifier si la requête a réussi
            response.raise_for_status()
            
            # Analyser la réponse JSON
            try:
                result = response.json()
            except json.JSONDecodeError:
                # Si la réponse n'est pas du JSON valide
                return {
                    "data": response.text,
                    "status_code": response.status_code,
                    "execution_time": execution_time,
                    "content_type": response.headers.get('Content-Type')
                }
            
            # Renvoyer les résultats
            return {
                "data": result,
                "status_code": response.status_code,
                "execution_time": execution_time,
                "headers": dict(response.headers)
            }
            
        except requests.exceptions.Timeout:
            logger.error(f"Timeout lors de la requête à {url}")
            return {"error": "Timeout de la requête"}
        except requests.exceptions.ConnectionError:
            logger.error(f"Erreur de connexion à {url}")
            return {"error": "Erreur de connexion à l'API"}
        except requests.exceptions.HTTPError as e:
            logger.error(f"Erreur HTTP {e.response.status_code} pour {url}: {str(e)}")
            return {
                "error": f"Erreur HTTP {e.response.status_code}",
                "status_code": e.response.status_code,
                "response": e.response.text
            }
        except Exception as e:
            logger.error(f"Erreur lors de la requête API à {url}: {str(e)}")
            return {"error": str(e)}
    
    def test_connection(self):
        """
        Teste si la connexion à l'API est fonctionnelle
        
        Returns:
            bool: True si la connexion est fonctionnelle, False sinon
        """
        if not self.is_connected:
            if not self.connect():
                return False
                
        try:
            # Tente une requête simple vers la racine de l'API
            result = self.fetch_data("/")
            return "error" not in result and result.get("status_code", 0) < 400
        except Exception:
            return False
    
# __init__.py - Module principal du tableau de bord
import logging
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)

# Création du Blueprint pour les routes du module
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

def get_module_info():
    """
    Retourne les informations sur ce module pour l'enregistrement
    
    Returns:
        dict: Informations sur le module
    """
    return {
        "name": "dashboard",
        "title": "Tableau de Bord",
        "description": "Tableau de bord principal des KPI de sécurité",
        "enabled": True,
        "icon": "dashboard",
        "order": 1  # Premier onglet
    }

# Données fictives pour le tableau de bord
def generate_mock_data(view_type, display_type, week=None, month=None, year=None):
    """
    Génère des données fictives pour le tableau de bord
    
    Args:
        view_type (str): Type de vue (weekly, monthly, yearly)
        display_type (str): Type d'affichage (total, average)
        week (int, optional): Numéro de semaine. Par défaut None.
        month (int, optional): Numéro de mois. Par défaut None.
        year (int, optional): Année. Par défaut None.
        
    Returns:
        dict: Données générées
    """
    # Configuration des technologies
    tech_data = [
        {"name": "Firewall", "color": "#4299E1"},
        {"name": "VPN", "color": "#48BB78"},
        {"name": "EDR", "color": "#F6AD55"},
        {"name": "SIEM", "color": "#F56565"},
        {"name": "IAM", "color": "#9F7AEA"},
        {"name": "DLP", "color": "#ED64A6"}
    ]
    
    # Configuration du personnel
    personnel_data = [
        {"name": "Alice", "color": "#4299E1"},
        {"name": "Bob", "color": "#48BB78"},
        {"name": "Carol", "color": "#F6AD55"},
        {"name": "David", "color": "#F56565"}
    ]
    
    # Générer des valeurs aléatoires basées sur les paramètres
    # Modifier les plages en fonction de la vue et du type d'affichage
    multiplier = 1
    if view_type == "weekly":
        multiplier = 0.25
    elif view_type == "yearly":
        multiplier = 12
        
    if display_type == "average":
        multiplier *= 0.1
    
    # Facteur d'aléatoire basé sur les paramètres pour rendre les données cohérentes
    seed = 0
    if year:
        seed += year * 1000
    if month:
        seed += month * 100
    if week:
        seed += week * 10
    random.seed(seed)
    
    # Générer les données pour les technologies
    for tech in tech_data:
        # Valeur de base basée sur la technologie (certaines ont plus de tickets que d'autres)
        base_value = {
            "Firewall": 30,
            "VPN": 20,
            "EDR": 15,
            "SIEM": 25,
            "IAM": 10,
            "DLP": 5
        }.get(tech["name"], 10)
        
        # Appliquer des variations aléatoires
        variation = random.uniform(0.7, 1.3)
        tech["value"] = int(base_value * multiplier * variation)
    
    # Générer les données pour le personnel
    for person in personnel_data:
        # Valeur de base basée sur la personne
        base_value = {
            "Alice": 12,
            "Bob": 8,
            "Carol": 15,
            "David": 10
        }.get(person["name"], 10)
        
        # Appliquer des variations aléatoires
        variation = random.uniform(0.8, 1.2)
        person["value"] = int(base_value * multiplier * variation)
    
    # Données de temps de traitement (en minutes)
    time_data = []
    for tech in tech_data:
        # Temps de base basé sur la technologie
        base_time = {
            "Firewall": 120,
            "VPN": 45,
            "EDR": 90,
            "SIEM": 150,
            "IAM": 60,
            "DLP": 30
        }.get(tech["name"], 60)
        
        # Appliquer des variations aléatoires
        variation = random.uniform(0.9, 1.1)
        time_data.append({
            "name": tech["name"],
            "value": int(base_time * variation),
            "color": tech["color"]
        })
    
    # Données pour le tableau de synthèse
    summary_data = {
        "total_tickets": sum(tech["value"] for tech in tech_data),
        "avg_processing_time": sum(t["value"] for t in time_data) // len(time_data),
        "critical_incidents": random.randint(5, 15),
        "resolution_rate": random.randint(90, 99)
    }
    
    # Tendances (augmentation ou diminution en pourcentage)
    trends = {
        "total_tickets": random.choice([-1, 1]) * random.randint(5, 15),
        "avg_processing_time": random.choice([-1, 1]) * random.randint(1, 10),
        "critical_incidents": random.choice([-1, 1]) * random.randint(10, 30),
        "resolution_rate": random.choice([-1, 1]) * random.randint(1, 5)
    }
    
    # Assembler toutes les données
    return {
        "tech_data": tech_data,
        "personnel_data": personnel_data,
        "time_data": time_data,
        "summary_data": summary_data,
        "trends": trends,
        "period": {
            "view_type": view_type,
            "display_type": display_type,
            "week": week,
            "month": month,
            "year": year
        }
    }

# Route pour récupérer les données du tableau de bord
@dashboard_bp.route('/data', methods=['GET'])
def get_dashboard_data():
    """
    Endpoint pour récupérer les données du tableau de bord
    
    Query params:
        view_type (str): Type de vue (weekly, monthly, yearly)
        display_type (str): Type d'affichage (total, average)
        week (int): Numéro de semaine (1-4)
        month (int): Numéro de mois (1-12)
        year (int): Année
        
    Returns:
        JSON: Données du tableau de bord
    """
    # Récupérer les paramètres de la requête
    view_type = request.args.get('view_type', 'monthly')
    display_type = request.args.get('display_type', 'total')
    
    # Convertir les valeurs numériques
    try:
        week = int(request.args.get('week', 1))
        month = int(request.args.get('month', datetime.now().month))
        year = int(request.args.get('year', datetime.now().year))
    except (ValueError, TypeError):
        return jsonify({"error": "Paramètres numériques invalides"}), 400
    
    # Valider les paramètres
    if view_type not in ['weekly', 'monthly', 'yearly']:
        return jsonify({"error": "Type de vue invalide"}), 400
        
    if display_type not in ['total', 'average']:
        return jsonify({"error": "Type d'affichage invalide"}), 400
        
    if week < 1 or week > 4:
        return jsonify({"error": "Numéro de semaine invalide"}), 400
        
    if month < 1 or month > 12:
        return jsonify({"error": "Numéro de mois invalide"}), 400
    
    # Générer les données en fonction des paramètres
    data = generate_mock_data(view_type, display_type, week, month, year)
    
    return jsonify(data)

# Fonction pour enregistrer les routes du module
def register_routes(app):
    """
    Enregistre les routes du module dans l'application
    
    Args:
        app (Flask): Application Flask
    """
    app.register_blueprint(dashboard_bp)
    logger.info("Routes du module dashboard enregistrées")

#!/bin/bash
# Script de démarrage du Dashboard KPI Sécurité

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Dashboard KPI Sécurité - Démarrage   ${NC}"
echo -e "${BLUE}========================================${NC}"

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Erreur: Python 3 n'est pas installé.${NC}"
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}Erreur: Node.js n'est pas installé.${NC}"
    exit 1
fi

# Vérifie si npm est installé
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Erreur: npm n'est pas installé.${NC}"
    exit 1
fi

# Chemin du répertoire du script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Répertoire du serveur
SERVER_DIR="$SCRIPT_DIR/server"
CLIENT_DIR="$SCRIPT_DIR/client"

# Vérifier si l'environnement virtuel existe
if [ ! -d "$SCRIPT_DIR/venv" ]; then
    echo -e "${YELLOW}Environnement virtuel non trouvé. Création...${NC}"
    python3 -m venv venv
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erreur lors de la création de l'environnement virtuel.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Environnement virtuel créé avec succès.${NC}"
fi

# Activer l'environnement virtuel
echo -e "${YELLOW}Activation de l'environnement virtuel...${NC}"
source "$SCRIPT_DIR/venv/bin/activate"

# Installer les dépendances du serveur si nécessaire
if [ ! -f "$SERVER_DIR/.deps_installed" ]; then
    echo -e "${YELLOW}Installation des dépendances Python...${NC}"
    pip install -r "$SCRIPT_DIR/requirements.txt"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erreur lors de l'installation des dépendances Python.${NC}"
        exit 1
    fi
    
    touch "$SERVER_DIR/.deps_installed"
    echo -e "${GREEN}Dépendances Python installées avec succès.${NC}"
fi

# Installer les dépendances du client si nécessaire
if [ ! -d "$CLIENT_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installation des dépendances Node.js...${NC}"
    cd "$CLIENT_DIR" && npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erreur lors de l'installation des dépendances Node.js.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Dépendances Node.js installées avec succès.${NC}"
fi

# Générer les certificats SSL si nécessaire
SSL_DIR="$SERVER_DIR/config/ssl"
if [ ! -f "$SSL_DIR/cert.pem" ] || [ ! -f "$SSL_DIR/key.pem" ]; then
    echo -e "${YELLOW}Génération des certificats SSL...${NC}"
    
    # S'assurer que le répertoire existe
    mkdir -p "$SSL_DIR"
    
    # Vérifier si le script de génération existe
    if [ -f "$SSL_DIR/generate_cert.sh" ]; then
        chmod +x "$SSL_DIR/generate_cert.sh"
        "$SSL_DIR/generate_cert.sh"
    else
        # Générer manuellement si le script n'existe pas
        openssl req -x509 -newkey rsa:4096 -nodes -out "$SSL_DIR/cert.pem" -keyout "$SSL_DIR/key.pem" -days 365 \
            -subj "/C=FR/ST=France/L=Paris/O=Security KPI Dashboard/OU=IT/CN=localhost"
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erreur lors de la génération des certificats SSL.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Certificats SSL générés avec succès.${NC}"
fi

# Démarrer le serveur et le client dans des processus séparés
echo -e "${YELLOW}Démarrage du serveur backend...${NC}"
cd "$SERVER_DIR" && python app.py &
SERVER_PID=$!

# Attendre que le serveur soit démarré
sleep 3

echo -e "${YELLOW}Démarrage du client frontend...${NC}"
cd "$CLIENT_DIR" && npm start &
CLIENT_PID=$!

# Fonction pour nettoyer les processus lors de la fermeture
cleanup() {
    echo -e "\n${YELLOW}Arrêt des processus...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo -e "${GREEN}Dashboard KPI Sécurité arrêté.${NC}"
    exit 0
}

# Intercepter les signaux pour le nettoyage
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Dashboard KPI Sécurité démarré!${NC}"
echo -e "${GREEN}Serveur backend: http://localhost:5001${NC}"
echo -e "${GREEN}Client frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter.${NC}"

# Maintenir le script en cours d'exécution
wait

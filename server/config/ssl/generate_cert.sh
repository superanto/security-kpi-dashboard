#!/bin/bash
# Script pour générer des certificats SSL auto-signés pour le développement

# Chemin du répertoire contenant ce script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Noms des fichiers de certificat et de clé
CERT_FILE="$SCRIPT_DIR/cert.pem"
KEY_FILE="$SCRIPT_DIR/key.pem"

# Message d'information
echo "Génération de certificats SSL auto-signés pour le développement..."
echo "Ces certificats ne devraient PAS être utilisés en production !"
echo ""

# Génération du certificat et de la clé avec OpenSSL
openssl req -x509 -newkey rsa:4096 -nodes -out "$CERT_FILE" -keyout "$KEY_FILE" -days 365 \
    -subj "/C=FR/ST=France/L=Paris/O=Security KPI Dashboard/OU=IT/CN=localhost"

# Vérification
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo "Certificats générés avec succès :"
    echo "Certificat : $CERT_FILE"
    echo "Clé privée : $KEY_FILE"
    
    # Définition des permissions correctes
    chmod 644 "$CERT_FILE"
    chmod 600 "$KEY_FILE"
    
    echo "Permissions configurées correctement."
else
    echo "Erreur lors de la génération des certificats."
    exit 1
fi

echo ""
echo "AVERTISSEMENT : En production, utilisez des certificats signés par une autorité de certification reconnue."

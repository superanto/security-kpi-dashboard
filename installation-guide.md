# Procédure d'installation du Dashboard KPI Sécurité

Ce document décrit en détail les étapes nécessaires pour installer et configurer le Dashboard KPI Sécurité sur votre système.

## Prérequis

### Système
- Linux 4.18.0 ou supérieur (testé sur 4.18.0-372.9.1.el8.x86_64)
- 4 Go de RAM minimum
- 2 CPU minimum

### Logiciels
- Python 3.6.8 ou supérieur
- Node.js 14.x ou supérieur
- npm 6.x ou supérieur
- Git (pour récupérer le code source)
- OpenSSL (pour la génération des certificats SSL)

## Installation

### 1. Récupération du code source

```bash
# Cloner le dépôt Git
git clone https://github.com/votre-organisation/security-kpi-dashboard.git
cd security-kpi-dashboard
```

### 2. Installation automatisée

La méthode la plus simple est d'utiliser le script d'installation automatique fourni :

```bash
# Rendre le script exécutable
chmod +x start.sh

# Exécuter le script
./start.sh
```

Le script effectuera automatiquement les étapes suivantes :
- Création d'un environnement virtuel Python
- Installation des dépendances Python et Node.js
- Génération des certificats SSL pour HTTPS
- Démarrage du serveur backend et du client frontend

### 3. Installation manuelle (alternative)

Si vous préférez une installation manuelle, suivez ces étapes :

#### 3.1. Configuration du backend (serveur Flask)

```bash
# Créer et activer un environnement virtuel Python
python3 -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

# Installer les dépendances Python
pip install -r requirements.txt

# Créer le répertoire pour les certificats SSL
mkdir -p server/config/ssl

# Générer des certificats SSL auto-signés
openssl req -x509 -newkey rsa:4096 -nodes -out server/config/ssl/cert.pem -keyout server/config/ssl/key.pem -days 365 -subj "/C=FR/ST=France/L=Paris/O=Security KPI Dashboard/OU=IT/CN=localhost"
```

#### 3.2. Configuration du frontend (client React)

```bash
# Se déplacer dans le répertoire client
cd client

# Installer les dépendances Node.js
npm install

# Revenir au répertoire racine
cd ..
```

## Configuration

### Configuration du serveur

Vous pouvez personnaliser la configuration du serveur en modifiant le fichier `server/config/settings.py` :

```python
# Exemple de configuration modifiée
SERVER_CONFIG = {
    'HOST': '0.0.0.0',  # Écouter sur toutes les interfaces
    'PORT': 5001,       # Port par défaut
    'DEBUG': False,     # Activer/désactiver le mode debug
    'ENABLE_HTTPS': True,  # Activer/désactiver HTTPS
}
```

### Configuration HTTPS avec des certificats valides

Pour une utilisation en production, remplacez les certificats auto-signés par des certificats valides signés par une autorité de certification reconnue :

```bash
# Copiez vos certificats dans le répertoire approprié
cp votre_certificat.pem server/config/ssl/cert.pem
cp votre_cle_privee.pem server/config/ssl/key.pem

# Assurez-vous que les permissions sont correctes
chmod 644 server/config/ssl/cert.pem
chmod 600 server/config/ssl/key.pem
```

### Configuration des connecteurs de données

Pour configurer les connecteurs SQL ou API, modifiez le fichier `server/config/settings.py` :

```python
# Exemple de configuration SQL
DATABASE_CONFIG = {
    'SQL': {
        'ENGINE': 'mysql',  # sqlite, mysql, postgresql
        'NAME': 'security_kpi',
        'USER': 'utilisateur_db',
        'PASSWORD': 'mot_de_passe_securise',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

## Démarrage de l'application

### Démarrage automatique

```bash
# Utiliser le script de démarrage (recommandé)
./start.sh
```

### Démarrage manuel

#### Démarrer le backend

```bash
# Activer l'environnement virtuel
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

# Démarrer le serveur Flask
cd server
python app.py
```

Le serveur sera accessible à l'adresse https://localhost:5001

#### Démarrer le frontend (en développement)

```bash
# Dans un nouveau terminal
cd client
npm start
```

Le client de développement sera accessible à l'adresse http://localhost:3000

#### Démarrer le frontend (en production)

```bash
# Construire l'application React
cd client
npm run build

# Les fichiers construits seront dans le dossier 'build'
# Le serveur Flask servira ces fichiers automatiquement
```

## Vérification de l'installation

1. Accédez à https://localhost:5001 dans votre navigateur
2. Vous devriez voir le Dashboard KPI Sécurité avec l'onglet "Dashboard" actif
3. Vérifiez que les visualisations se chargent correctement
4. Testez les filtres (hebdomadaire, mensuel, annuel)

Si vous rencontrez des problèmes avec le certificat SSL auto-signé, vous devrez accepter le risque dans votre navigateur.

## Résolution des problèmes courants

### Le serveur ne démarre pas

Vérifiez les erreurs dans la console et assurez-vous que :
- Le port 5001 n'est pas déjà utilisé
- Les certificats SSL sont correctement générés
- L'environnement virtuel Python est activé

### Erreurs côté client

Si le frontend ne se charge pas correctement :
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que toutes les dépendances Node.js sont installées
- Vérifiez que le proxy de développement est correctement configuré

### Problèmes d'accès au serveur

Si vous ne pouvez pas accéder au serveur depuis un autre ordinateur :
- Vérifiez que le serveur écoute sur toutes les interfaces (`0.0.0.0`)
- Assurez-vous que le port 5001 est ouvert dans votre pare-feu
- Vérifiez que le certificat SSL inclut le nom d'hôte correct

## Configuration en production

Pour un déploiement en production, il est recommandé de :

1. Utiliser un serveur WSGI comme Gunicorn pour le backend
2. Mettre en place un serveur proxy comme Nginx devant l'application
3. Utiliser des certificats SSL valides signés par une autorité de certification reconnue
4. Configurer une authentification utilisateur

Exemple de commande pour démarrer avec Gunicorn :

```bash
# Installer Gunicorn
pip install gunicorn

# Démarrer l'application avec Gunicorn
cd server
gunicorn --bind 0.0.0.0:5001 --certfile config/ssl/cert.pem --keyfile config/ssl/key.pem --workers 4 app:app
```

## Mise à jour de l'application

Pour mettre à jour l'application vers une nouvelle version :

```bash
# 1. Arrêter l'application en cours d'exécution
# 2. Sauvegarder vos configurations personnalisées
cp server/config/settings.py server/config/settings.py.backup

# 3. Mettre à jour le code source
git pull

# 4. Mettre à jour les dépendances
source venv/bin/activate
pip install -r requirements.txt
cd client && npm install && cd ..

# 5. Restaurer vos configurations si nécessaire
cp server/config/settings.py.backup server/config/settings.py

# 6. Redémarrer l'application
./start.sh
```

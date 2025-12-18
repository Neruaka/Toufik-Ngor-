#!/bin/bash
# ============================================
# SCRIPT DE GÉNÉRATION DU KEYFILE MONGODB
# ============================================

echo "🔑 Création du keyfile MongoDB..."

# Génère 756 octets de données aléatoires en base64
openssl rand -base64 756 > mongo-keyfile

# Permissions strictes requises par MongoDB (lecture seule par le propriétaire)
chmod 400 mongo-keyfile

echo "✅ Keyfile créé avec succès !"
ls -la mongo-keyfile

#!/bin/bash
# ============================================
# SCRIPT D'INITIALISATION DU REPLICA SET
# ============================================

echo "⏳ Attente de la disponibilité des serveurs MongoDB..."
sleep 20

echo "🔧 Initialisation du replica set rs0..."

mongosh --host mongodb-primary:27017 -u "$MONGO_ROOT_USER" -p "$MONGO_ROOT_PASSWORD" --authenticationDatabase admin <<EOF
try {
    var status = rs.status();
    print("✅ Replica set déjà initialisé : " + status.set);
} catch (e) {
    print("⚙️ Replica set non initialisé, création en cours...");
    var result = rs.initiate({
        _id: "rs0",
        members: [
            { _id: 0, host: "mongodb-primary:27017", priority: 2 },
            { _id: 1, host: "mongodb-replica:27017", priority: 1 }
        ]
    });
    print("Résultat de l'initialisation : " + JSON.stringify(result));
    if (result.ok == 1) {
        print("✅ Replica set initialisé avec succès !");
    } else {
        print("❌ Erreur lors de l'initialisation : " + result.errmsg);
    }
}
EOF

sleep 5
echo "📊 Statut du replica set :"
mongosh --host mongodb-primary:27017 -u "$MONGO_ROOT_USER" -p "$MONGO_ROOT_PASSWORD" --authenticationDatabase admin --eval "rs.status()"

echo "🎉 Configuration terminée !"
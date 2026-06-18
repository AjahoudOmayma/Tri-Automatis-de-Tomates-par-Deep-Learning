## Contribution personnelle - Omayma Ajahoud

Ma contribution principale dans ce projet a porté sur l'intégration du modèle YOLOv8 dans l'application web.

### Backend

* Développement du backend Flask.
* Intégration du modèle YOLOv8 entraîné dans l'API Flask.
* Implémentation de l'endpoint `/predict` pour la détection à partir d'images uploadées.
* Implémentation de l'endpoint `/predict-frame` pour les prédictions en temps réel à partir de la webcam.
* Gestion des échanges de données entre le frontend et le modèle de détection.

### Frontend

* Travail sur la page `detection.tsx`.
* Intégration de l'upload d'images vers le backend Flask.
* Intégration des prédictions du modèle YOLOv8 dans l'interface utilisateur.
* Affichage des classes détectées, des scores de confiance et des bounding boxes.
* Intégration de la webcam avec `react-webcam`.
* Mise en place de la détection en temps réel (Live Camera Detection).
* Synchronisation de l'affichage des bounding boxes avec les résultats retournés par le modèle.

### Remarque

Le modèle YOLOv8 final utilisé dans l'application a été entraîné et validé par un autre membre de l'équipe. Ma contribution a consisté à intégrer ce modèle dans une application web fonctionnelle permettant la détection sur image et la détection en temps réel via webcam.

## Contribution personnelle : L'brek Oumaima

### Frontend — Dashboard

* J’ai conçu et développé la page Dashboard de l’application afin d’offrir une vue synthétique et exploitable des résultats de détection.

* J’ai mis en place l’affichage des indicateurs principaux du projet sous forme de cartes statistiques (KPI) pour les quatre classes de détection : Healthy Tomato, Anthracnose, Blossom End Rot et Spotted Wilt Virus.

* J’ai développé un graphique de tendances permettant de visualiser l’évolution des détections sur les derniers jours.

* J’ai intégré une section de suivi des performances système pour afficher des métriques globales comme le nombre total d’images analysées, la moyenne de confiance et le temps moyen d’inférence.

* J’ai réalisé un tableau des détections récentes pour présenter de manière structurée les informations essentielles : date, total des détections, répartition par classe, niveau de confiance et statut.

### Backend — app.py

* J’ai modifié le fichier app.py afin d’exploiter correctement les résultats retournés par le modèle de détection.

* J’ai participé à la structuration des données nécessaires au dashboard, en préparant les champs utilisés pour l’analyse statistique : totalDetections, anthracnose, blossomEndRot, healthy, spottedWiltVirus et averageConfidence.

* J’ai contribué à l’intégration entre le backend et le frontend pour que les résultats de détection puissent être récupérés et affichés de manière cohérente dans l’interface.

![Description de l'image](‪C:\Users\hp\Downloads\dashboard_1.jpeg)
![Description de l'image](‪C:\Users\hp\Downloads\dashboard_2.jpeg)

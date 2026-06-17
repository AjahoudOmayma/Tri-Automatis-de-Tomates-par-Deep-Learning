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

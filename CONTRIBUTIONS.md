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

## Contribution personnelle - L'BREK Oumaima

Ma contribution principale dans ce projet a porté sur le développement de la page Dashboard et sur l’intégration des données de détection dans l’interface web.

### Frontend

* Conception et développement de la page `dashboard.tsx`.
* Mise en place d’une vue synthétique des résultats de détection.
* Affichage des indicateurs principaux du projet sous forme de cartes statistiques (KPI) pour les quatre classes : Healthy Tomato, Anthracnose, Blossom End Rot et Spotted Wilt Virus.
* Développement d’un graphique de tendances pour visualiser l’évolution des détections.
* Intégration d’une section de suivi des performances système avec des métriques globales comme le nombre total d’images analysées, la moyenne de confiance et le temps moyen d’inférence.
* Réalisation d’un tableau des détections récentes pour présenter la date, le total des détections, la répartition par classe, le niveau de confiance et le statut.

### Backend

* Modification du fichier `app.py` afin d’exploiter correctement les résultats retournés par le modèle de détection.
* Structuration des données nécessaires au dashboard pour l’analyse statistique : `totalDetections`, `anthracnose`, `blossomEndRot`, `healthy`, `spottedWiltVirus` et `averageConfidence`.
* Contribution à l’intégration entre le backend et le frontend pour permettre la récupération et l’affichage cohérents des résultats de détection.

### Conclusion

Cette contribution m’a permis de participer à la mise en place d’une interface de visualisation claire et fonctionnelle, reliant le backend de détection au frontend. Grâce au dashboard et à l’exploitation des données dans `app.py`, le projet offre une meilleure lecture des résultats, une visualisation plus structurée des performances et une expérience utilisateur plus complète.

## Contribution personnelle - Khadija El Gourain

Ma contribution principale dans ce projet a porté sur la partie modèle YOLOv8 pour la détection et la classification des tomates.

### Modèle et entraînement

- Préparation et vérification du dataset au format YOLOv8.
- Entraînement d’un modèle baseline YOLOv8n.
- Évaluation du modèle avec les métriques Precision, Recall, mAP50 et mAP50-95.
- Analyse des courbes de loss : box_loss, cls_loss et dfl_loss.
- Étude du surapprentissage à partir des courbes train/validation.

### Améliorations testées

- Entraînement avec data augmentation.
- Ajout d’images négatives pour réduire les fausses détections sur des objets non-tomates.
- Création de labels vides pour les images négatives.
- Comparaison entre baseline, modèle augmenté et modèle avec images négatives.

### Analyse des résultats

- Analyse des matrices de confusion.
- Comparaison des performances entre les différents modèles.
- Test du modèle sur des images réelles.
- Identification des limites du modèle sur des images complexes : tomates avec poivrons, mains, objets rouges ou fonds de cuisine.

### Conclusion

Le modèle baseline reste le plus stable pour la détection standard des tomates.  
L’expérience avec images négatives est conservée comme amélioration de robustesse, mais elle nécessite davantage d’images réelles mixtes pour devenir plus fiable en conditions réelles.

## Contribution personnelle – Laila Ilillou

Ma contribution principale dans ce projet a porté sur le développement du système d'historique des détections.

### Backend Flask

* Développement du système d'enregistrement des prédictions dans un fichier `history.json`.
* Création des fonctions de sauvegarde et de récupération de l'historique.
* Ajout de l'API `/history` permettant d'accéder aux détections enregistrées.
* Enregistrement de la date, du nom de l'image, des classes détectées et du score moyen de confiance après chaque prédiction.

### Frontend React

* Développement et amélioration de la page `history.tsx`.
* Affichage des détections enregistrées sous forme de tableau.
* Affichage de la date et de l'heure de chaque prédiction.
* Affichage du nombre de détections pour chaque classe :

  * Anthracnose
  * Blossom End Rot
  * Healthy Tomato
  * Spotted Wilt Virus
* Mise en place de la recherche et du filtrage des historiques par classe.
* Ajout de la pagination pour faciliter la consultation des résultats.

### Remarque

Ma contribution a consisté à concevoir et intégrer un système complet de suivi et de consultation de l'historique des détections au sein de l'application web.

## Contribution personnelle - Wiam Outchadmit 

Ma contribution personnelle a porté sur le développement des pages Results et Performance ainsi que sur l’exploitation des données de détection pour l’analyse et la visualisation des résultats.

### Frontend — Results Interpretation

* Conception et développement de la page Results Interpretation pour l’analyse globale des détections.
* Implémentation du calcul automatique des indicateurs à partir de l’historique des résultats (taux de classes, confiance moyenne et total des détections).
* Mise en place d’une analyse globale de l’état du système (Stable / Warning / Critical) basée sur la proportion de maladies détectées.
* Ajout d’un système de recommandations automatiques basé sur les résultats du modèle.
* Développement d’une analyse comparative des sessions afin d’identifier la meilleure session et la session la plus critique.

### Frontend — Model Performance

* Conception et développement de la page Model Performance pour l’évaluation des performances du modèle YOLOv8.
* Remplacement des données statiques par des métriques calculées à partir des données réelles du backend.
* Implémentation des métriques de performance : Accuracy, Precision, Recall et F1-Score.
* Mise en place de visualisations avancées (Radar Chart, courbe d’inférence et distribution des classes).
* Exploitation des données de détection pour produire des indicateurs de performance cohérents et dynamiques.

### Backend — Exploitation des données

* Utilisation des données issues de l’API `/history` pour la génération des analyses statistiques.
* Structuration et exploitation des résultats du modèle (classes détectées, scores de confiance et horodatage) pour l’analyse frontend.



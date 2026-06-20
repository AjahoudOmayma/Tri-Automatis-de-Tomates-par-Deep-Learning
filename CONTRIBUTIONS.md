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

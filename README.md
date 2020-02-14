
## Almost Zelda  
  
Ceci est un mini-projet-test-technique permettant de créer un petit jeu "à la Zelda".  
Le joueur doit attraper un diamant et rejoindre la sortie d'une carte, en un minimum de temps.  
Le score peut être envoyé à une API, et le joueur a la possibilité de voir les scores  
enregistrés.  
  
### Requirements  
  
### Installation & utilisation  
  
#### Installation du client (le jeu en React)  
 * Installation des vendors : `yarn install`  
 * Lancement du serveur : `yarn build`  
  
#### Installation de l'API  
L'API, permettant la sauvegarde des scores, est conçue pour tourner sur AWS Lambda.  
Idéalement, vous devriez trouver dans le dossier serverless une configuration Cloudformation, vous permettant de créer  en quelques lignes de commandes les fonctions Lambda et de configurer AWS API Gateway (pour le routage des requêtes)   ainsi que DynamoDB (permettant le stockage des scores).  
  
Malheureusement, votre humble serviteur n'a pas trouvé le temps de s'y attaquer. Vous trouverez donc dans le dossier  __serverless__ deux fichiers :  
 * __get-scores.js__ : fonction Node à installer dans Lambda, permettant de récupérer les scores dans DynamoDB.  
  Elle doit être liée à une requête GET dans API Gateway.  
 * __set-score.js__ : une autre fonction Node à installer dans Lambda, permettant de sauvegarder les scores dans  
  DynamoDB. Elle doit être liée à une requête POST dans API Gateway.  
  
### Technologie  
Le projet est basé sur React de manière assez classique, ainsi que sur Webpack.  
  
On notera l'utilisation de **react-spritesheet** pour le chargement et le découpage du spritesheet, situé  dans `public/sprite.png`. Il suffit de donner les coordonnées et la taille des images à découper dans le spritesheet,   le composant fait le reste. L'exemple le plus parlant est le composant __Diamond__.  
  
__index.js__ est le point d'entrée. Il charge le composant principal __App__.  
  
### Composants  
 * __App__ va construire l'interface, composée du chronomètre (__Chrono__), de l'affichage des vies (__Life__) et du  jeu en lui-même (__Game__)  
 * __Game__ est sans doute le composant le plus important : il gère toute la mécanique du jeu ainsi que d'assembler  les différents composants à l'intérieur du jeu : écrans, scores (__ScoreTable__), modales...  
    
 * __MapCanvas__ est chargé de construire la carte du jeu : il va parser une suite de chaines de caractères situés dans  le fichier de configuration __Map.js__ pour placer les tuiles une par une sur un Canvas.  Pour chaque caractère, l'agorithme vérifie chaque case adjacente et en déduit le sprite le plus adéquat (exemple : bordure d'une zone boueuse).
 * __Diamond__ est une représentation du diamant à placer sur la carte. Un composant spécifique a été créé pour cette   tuile car elle est retirée de la carte quand le joueur la touche.  
    
 * __Player__ est le composant chargé d'afficher et de gérer les déplacements du joueur. Étant donné que le Canvas  généré par __MapCanvas__ est une simple image bitmap, __Player__ va se charger de construire sa propre version  
  "abstraite" de la carte, et la comparer avec les déplacements du joueur.  
  Pour y parvenir __Player__ va récupérer le type de chaque cellule et va calculer la taille de chacune d'entre elle.   Ainsi le composant sera capable de connaitre le type de tuile qui correspond à la position actuelle du joueur.  Il pourra alors en déduire si le joueur tente d'accèder à une zone qu'il n'a pas accès (et l'en empêcher), s'il touche   le diamant, s'il s'agit de boue ou encore s'il parvient à la sortie, et déclencher les actions nécessaires.  
    
 * __Chrono__ gère le chronomètre. Il est déclenché par __Game__ lors du démarrage de la partie, et peut être mis en   pause par ce dernier.  
    
 * __Life__ permet la gestion des vies du joueur, et d'en supprimer si nécessaire.  
    
 * __ScoreTable__ s'occupe de récupérer les scores, ou d'en envoyer à l'API. Il est également chargé de gèrer  l'affichage des scores déjà enregistrés.  
    
 * __SplashScreen__ est un simple composant d'affichage, permettant d'afficher l'écran d'accueil.  
  
### Gestion du focus  
Afin de garantir le focus et une navigation au clavier, __Game__ force le focus sur le bouton de la modale lorsqu'elle est affichée (`showModal()`), et le force sur le personnage du jeu lorsqu'elle est masquée (`hideModal()`).  
Ainsi le joueur est garanti d'avoir toujours le focus sur l'élément le plus important.  
  
Il s'agit d'un comportement à proscrire en temps normal au sein d'une page web, mais nous en faisons abstraction ici en raison du nombre d'éléments très limité (pas plus d'une action possible à la fois en dehors de l'écran d'accueil).

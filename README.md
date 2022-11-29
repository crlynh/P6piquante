# PROJET 6 - PIQUANTE

## Objectif du projet : Construire une API sécurisée pour une application d'avis gastronomiques

Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées secrètes. Pour tirer parti de son succès et générer davantage de buzz, l'entreprise souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.


## Technologies utilisées 
 * NodeJS
 * Express
 * MongoDB
 
  
## Installation

Cloner ce repository 
   ```sh
   git clone https://github.com/crlynh/piquante.git
   ```
   
### Backend 
   
* Installer les packages
   ```sh
   npm install
   ```
* Créer un dossier /images 
* Créer un ficher .env en complétant les paramètres suivants :
   ```sh
    PASSWORD_MONGOOSE= 
    TOKEN_SECRET=
   ```

* Lancer le serveur
   ```sh
   npm start
   ```
   
* Le message suivant doit s'afficher 
   ```sh
    > piquante@1.0.0 start
    > node server.js

    Listening on port 3000
    Connexion à MongoDB réussie !
   ```
 

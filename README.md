# ArchiCours : cours d'architecture des ordinateurs

Ouvrez `index.html` dans un navigateur.

## Structure
- `index.html`, `cours.html`, `about.html`, `contact.html` : pages du site
- `pages/` : un fichier HTML par cours (avec son `js/<nom>.js`)
- `style.css` : styles communs (thème clair/sombre, RTL)
- `js/common.js` : en-tête, pied de page et bascule FR/AR partagés
- `js/site.js` : liste des cours (`PAGES`), traductions des pages du site, formulaire de contact
- `images/` : pages du cours en JPEG

## Ajouter un cours
1. Copiez `pages/cours-8086.html` en `pages/mon-cours.html` (gardez `data-root="../" data-nav="cours"` sur `<body>`).
2. Créez `js/mon-cours.js` : il définit `window.AR = [["début du texte français","traduction"], ...]` puis la logique de la page. Chargez-le AVANT `../js/common.js`.
3. Ajoutez un objet à `PAGES` dans `js/site.js` : `{href:"pages/mon-cours.html", fr:{t,d}, ar:{t,d}}`. La carte apparaît sur l'accueil et sur `cours.html`.

## Contact
Dans `js/site.js`, remplacez la constante `EMAIL` par votre adresse.
# ILTIcours

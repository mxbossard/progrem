
const titre = document.querySelector('.titre');
titre.innerHTML = "Le coeur d'Eugène Beutel.";

function initialiserProgrem(cadreLargeur, cadreHauteur) {
    const contexte = {};

    // Définition de l'encadrement des coordonnées cartesiennes
    const X_MIN = -1.3;
    const X_MAX = 1.3;
    const Y_MIN = -1.15;
    const Y_MAX = 1.4;

    // Calcul de la resolution des coordonnées cartesiennes
    contexte.resolutionCartesienneEnX = (X_MAX - X_MIN) / cadreLargeur;
    contexte.resolutionCartesienneEnY = - (Y_MAX - Y_MIN) / cadreHauteur;

    // Calcul du décallage des coordonnées cartesiennes
    contexte.decallageCartesienEnX = X_MIN + cadreLargeur % 2 * contexte.resolutionCartesienneEnX / 2;
    contexte.decallageCartesienEnY = Y_MAX + cadreHauteur % 2 * contexte.resolutionCartesienneEnY / 2;

    return contexte;
}

function colorerProgrem(colonne, ligne, contexte) {
    var couleur;

    // Calcul des coordonnées cartesiennes (x, y) du pixel
    const x = colonne * contexte.resolutionCartesienneEnX + contexte.decallageCartesienEnX;
    const y = ligne * contexte.resolutionCartesienneEnY + contexte.decallageCartesienEnY;
    
    const equationEugenePartieGauche = Math.pow((Math.pow(x, 2) + Math.pow(y, 2) -1), 3);
    const equationEugenePartieDroite = Math.pow(x, 2) * Math.pow(y, 3)
    const equationEugeneDifference = equationEugenePartieGauche - equationEugenePartieDroite;
    
    if ( equationEugeneDifference < 0 ) {
        couleur = 'rgb(255, 102, 153)'; // Couleur rose #FF6699
    } else {
        couleur = 'rgb(135, 206, 235)'; // Couleur bleu ciel
        //couleur = 'rgb(135, 206, 250)'; // Couleur lightskyblue
    }

    return couleur;
}
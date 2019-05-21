var code = document.querySelector('.code');
code.height = 400;

var canvas = document.querySelector('.progrem');
var ecran_largeur = window.innerWidth;
var ecran_hauteur = window.innerHeight;
var ecran_ratio = 0.8;

var image_ratio = 1;

var tuile_taille = 20;

var cartesian_largeur = 2.6;
var cartesian_hauteur = 2.6;
var cartesian_resolution = 0.01;

var trait_epaisseur = 10;

var image_largeur = ecran_largeur * ecran_ratio;
var image_hauteur = ecran_hauteur * ecran_ratio;

if (image_hauteur * image_ratio > image_largeur) {
    image_hauteur = image_largeur / image_ratio;
} else {
    image_largeur = image_hauteur * image_ratio;
}

var bord_largeur = (ecran_largeur - image_largeur) / 2;
var bord_hauteur = (ecran_hauteur - image_hauteur) / 2;


var code = document.querySelector('.code');
code.width = ecran_largeur;

var context = canvas.getContext('2d');
context.fillStyle = 'rgb(255, 102, 153)'; // Couleur rose #FF6699

function drawTiles(tuile_taille, x_nombre_tuiles, y_nombre_tuiles, painter) {
    var cadre_largeur = x_nombre_tuiles * tuile_taille;
    var cadre_hauteur = y_nombre_tuiles * tuile_taille;

    canvas.width = cadre_largeur;
    canvas.height = cadre_hauteur;

    context.clearRect(0, 0, cadre_largeur, cadre_hauteur);

    for (var l = 0; l < cadre_hauteur; l = l + tuile_taille) {
        for (var c = 0 ; c < cadre_largeur ; c = c + tuile_taille) {
            if (typeof painter == 'function')
                painter(context, c, l, cadre_largeur, cadre_hauteur);
            context.fillRect(c, l, tuile_taille, tuile_taille);
        }
    }
}

async function drawCartesianTiles(tuile_taille, x_nombre_tuiles, y_nombre_tuiles, x_min, x_max, y_min, y_max, cartesian_painter) {
    var cadre_largeur = x_nombre_tuiles * tuile_taille;
    var cadre_hauteur = y_nombre_tuiles * tuile_taille;

    canvas.width = cadre_largeur;
    canvas.height = cadre_hauteur;
    
    var x_resolution = (x_max - x_min) / cadre_largeur * tuile_taille;
    var y_resolution = (y_max - y_min) / cadre_hauteur * tuile_taille;
    //console.log(x_min, x_max, x_resolution, y_min, y_max, y_resolution);

    context.clearRect(0, 0, cadre_largeur, cadre_hauteur);

    // x et y représentent les coordonnées du milieu de chaque tuiles
    for (var y = y_min + y_resolution / 2 ; y <= y_max ; y = y + y_resolution) {
        for (var x = x_min + x_resolution / 2 ; x <= x_max; x = x + x_resolution) {
            if (typeof cartesian_painter == 'function')
                cartesian_painter(context, x, y, cadre_largeur, cadre_hauteur);

            // FIXME: not sure round is the right function to not have blank lines inside the painting
            var c = Math.round((x - x_resolution / 2 - x_min) / (x_max - x_min) * cadre_largeur / tuile_taille) * tuile_taille;
            var l = cadre_hauteur - Math.round((y - y_resolution / 2 - y_min) / (y_max - y_min) * cadre_hauteur / tuile_taille) * tuile_taille;
            //console.log('drawCartesianTiles: (x, y) => (c, l)', x, y, c, l);
            context.fillRect(c, l, tuile_taille, tuile_taille);

            //await sleep(2);
        }
    }
}

async function drawCoeurCoordCarthesien() {
    var egalite_precision = 0.00001;
    var points_dictionaire = new Map();
    for (var y = - cartesian_hauteur / 2 ; y < cartesian_hauteur / 2; y = y + cartesian_resolution) {
        for (var x = - cartesian_largeur / 2 ; x < cartesian_largeur / 2; x = x + cartesian_resolution) {
            // Coeur d'Eugène Beutel (1909) (x² + y² -1)³ = x²y³
            if ( coeur_eugene_beutel_filled(x, y, egalite_precision) ) {
                //context.fillStyle = 'rgb(255, 255, 255)';
                var c = Math.round((x + cartesian_largeur / 2) / cartesian_largeur * image_largeur + bord_largeur);
                var l = Math.round((cartesian_hauteur / 2 - y) / cartesian_hauteur * image_hauteur + bord_hauteur);
                var key = 'key_' + Math.round(c / trait_epaisseur) + '_' + Math.round(l / trait_epaisseur);
                //console.log(key);
                if (!points_dictionaire.has(key)) {
                    context.fillRect(c, l, trait_epaisseur, trait_epaisseur);
                    points_dictionaire.set(key, true);
                } else {
                    //console.log('cached');
                    continue;
                }
                //console.log('egalité pour', c, l);

                await sleep(1);
            }
        }
    }
} 

function drawCoeurCoordLigneColone() {
    var egalite_precision = 0.01;
    for (var l = bord_hauteur; l < bord_hauteur + image_hauteur; l = l + trait_epaisseur) {
        for (var c = bord_largeur ; c < bord_largeur + image_largeur ; c = c + trait_epaisseur) {
            var x = (c - (ecran_largeur / 2)) / image_largeur * cartesian_largeur;
            var y = ((ecran_hauteur / 2) - l) / image_hauteur * cartesian_hauteur;

            //console.log('Coordonnées (c, l) :', c, l);
            //console.log('Coordonnées (x, y) :', x, y);

            context.fillStyle = 'rgb(255, 102, 153)';
            context.fillRect(c, l, trait_epaisseur, trait_epaisseur);

            // cf https://www.mathcurve.com/courbes2d/ornementales/ornementales.shtml

            // Coeur d'Eugène Beutel (1909) (x² + y² -1)³ = x²y³
            if ( coeur_eugene_beutel(x, y, egalite_precision) ) {
                context.fillStyle = 'rgb(255, 255, 255)';
                context.fillRect(c, l, trait_epaisseur, trait_epaisseur);
                //console.log('egalité pour', c, l);
            }
        }
    }
}

function coeur_eugene_beutel(x, y, precision) {
    return Math.pow((Math.pow(x, 2) + Math.pow(y, 2) -1), 3) < Math.pow(x, 2) * Math.pow(y, 3) + precision 
        && Math.pow((Math.pow(x, 2) + Math.pow(y, 2) -1), 3) > Math.pow(x, 2) * Math.pow(y, 3) - precision;
}

function coeur_eugene_beutel_filled(x, y, precision) {
    return Math.pow((Math.pow(x, 2) + Math.pow(y, 2) -1), 3) - Math.pow(x, 2) * Math.pow(y, 3)  + precision < 0; 
}

function colorTilesGrapher(context, c, l, cadre_largeur, cadre_hauteur) {
    var rouge = 255 - Math.floor(255 * c / cadre_largeur );
    var vert = 255 - Math.floor(255 * l / cadre_hauteur );
    var bleu = Math.floor(Math.random() * 255);
    context.fillStyle = `rgb(${rouge}, ${vert}, ${bleu})`;
}

function eugeneBeutelCoeurCartesianGrapher(context, x, y, cadre_largeur, cadre_hauteur) {
    var egalite_precision = 0;
    if ( coeur_eugene_beutel_filled(x, y, egalite_precision) ) {
        context.fillStyle = 'rgb(255, 102, 153)'; // Couleur rose #FF6699
    } else {
        context.fillStyle = 'rgb(255, 255, 255)'; // Couleur blanche
    }
}

//drawCoeurCoordCarthesien();
//drawTiles(10, 37, 37, colorTilesGrapher);
/*
setInterval(function() { 
    drawTiles(10, 37, 37, colorTilesGrapher); 
}, 100);
*/

var k = 0;
setInterval(function() {
    var tuile_taille = 10;
    var tuile_nombre = Math.floor(370 / tuile_taille / 2) * 2 + 1;
    var zoom = k % 4 / 8;
    drawCartesianTiles(tuile_taille, tuile_nombre, tuile_nombre, - 1.3 - zoom, 1.3 + zoom, - 1.3 - zoom, 1.3 + zoom, eugeneBeutelCoeurCartesianGrapher);
    k ++;
}, 100);


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
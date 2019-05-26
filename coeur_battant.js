
var titre = document.querySelector('.titre');
titre.innerHTML = 'Un coeur battant.';

var ecran_largeur = window.innerWidth;
var ecran_hauteur = window.innerHeight;

var code = document.querySelector('.code');
code.width = ecran_largeur;
code.height = 400;

var canvas = document.querySelector('.progrem');

var TUILE_TAILLE = 10;
var IMAGE_LARGEUR = 370;
var IMAGE_HAUTEUR = 370;

var context = canvas.getContext('2d');
context.fillStyle = 'rgb(255, 102, 153)'; // Couleur rose #FF6699

function drawCartesianTiles(tuile_taille, x_nombre_tuiles, y_nombre_tuiles, x_min, x_max, y_min, y_max, cartesian_painter) {
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
        }
    }
}

function coeur_eugene_beutel_filled(x, y, precision) {
    return Math.pow((Math.pow(x, 2) + Math.pow(y, 2) -1), 3) - Math.pow(x, 2) * Math.pow(y, 3)  + precision < 0; 
}

function eugeneBeutelCoeurCartesianGrapher(context, x, y, cadre_largeur, cadre_hauteur) {
    var egalite_precision = 0;
    if ( coeur_eugene_beutel_filled(x, y, egalite_precision) ) {
        context.fillStyle = 'rgb(255, 102, 153)'; // Couleur rose #FF6699
    } else {
        context.fillStyle = 'rgb(255, 255, 255)'; // Couleur blanche
    }
}

var k = 0;
var previousRepaintTime = 0;

function step(timestamp) {
    if (timestamp - previousRepaintTime > 100) {
        previousRepaintTime = timestamp;

        var x_tuile_nombre = Math.floor(IMAGE_LARGEUR / TUILE_TAILLE / 2) * 2 + 1;
        var y_tuile_nombre = Math.floor(IMAGE_HAUTEUR / TUILE_TAILLE / 2) * 2 + 1;
        var zoom = k % 4 / 8;
        drawCartesianTiles(TUILE_TAILLE, x_tuile_nombre, y_tuile_nombre, - 1.3 - zoom, 1.3 + zoom, - 1.3 - zoom, 1.3 + zoom, eugeneBeutelCoeurCartesianGrapher);
        k ++;
    }
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
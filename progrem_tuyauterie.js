
const TUILE_TAILLE = 20;
const IMAGE_LARGEUR = 17;
const IMAGE_HAUTEUR = 17;

const ECRAN_LARGEUR = window.innerWidth;
const ECRAN_HAUTEUR = window.innerHeight;

const code = document.querySelector('.code');
code.width = ECRAN_LARGEUR * 0.9;
code.height = 700;

const canvas = document.querySelector('.progrem');
const canvasContext = canvas.getContext('2d');

function construireCadre(tuileTaille, largeur, hauteur) {
    const cadre = {};
    cadre.largeur = largeur;
    cadre.hauteur = hauteur;
    cadre.tuileTaille = tuileTaille;
    
    cadre.etat = etat = {};
    etat.colonne = 0;
    etat.ligne = 0;
    etat.imageIndex = 0;
    etat.images = [];
    etat.contexte = initialiserProgrem(largeur, hauteur);

    return cadre;
}

function avanceEtatSuivant(cadre) {
    const etat = cadre.etat;

    etat.colonne ++;
    if (etat.colonne >= cadre.largeur) {
        etat.colonne = 0;
        etat.ligne ++;
    }

    if (etat.ligne >= cadre.hauteur) {
        etat.ligne = 0;
        etat.imageIndex ++;
    }
}

var cadre;
function resetCanvas() {
    // /Initialisation du cadre
    cadre = construireCadre(TUILE_TAILLE, IMAGE_LARGEUR, IMAGE_HAUTEUR);
    canvas.width = cadre.tuileTaille * cadre.largeur;
    canvas.height = cadre.tuileTaille * cadre.hauteur;

    cadre.peindreParLigne = peintureSelecteur.value === 'ligne';
    cadre.peindreParImage = peintureSelecteur.value === 'image';
    //console.log('peindreParLigne:', peindreParLigne, 'peindreParImage:', peindreParImage);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(peindre);
}

const peintureSelecteur = document.querySelector('select.peinture');
peintureSelecteur.addEventListener('change', (event) => {
    cadre.peindreParLigne = event.target.value === 'ligne';
    cadre.peindreParImage = event.target.value === 'image';
    //console.log('peindreParLigne:', peindreParLigne, 'peindreParImage:', peindreParImage);

    resetCanvas();
});

const peindreButton = document.querySelector('button.peindre');
peindreButton.addEventListener('click', (event) => {
    resetCanvas();
});

var previousRepaintTime = 0;
function peindre(timestamp) {
    if (timestamp - previousRepaintTime > 100) {
        var ligneCourrante = cadre.etat.ligne;
        var imageCourrante = cadre.etat.imageIndex;

        do {
            previousRepaintTime = timestamp;
            var etat = cadre.etat;
            var c = etat.colonne;
            var l = etat.ligne;
            var ctx = etat.contexte;
            var tuileTaille = cadre.tuileTaille;

            var couleur = colorerProgrem(c, l, ctx);
            canvasContext.fillStyle = couleur;
            canvasContext.fillRect(c * tuileTaille, l * tuileTaille, tuileTaille, tuileTaille);

            avanceEtatSuivant(cadre);
        } while (  cadre.peindreParLigne && cadre.etat.ligne === ligneCourrante
                || cadre.peindreParImage && cadre.etat.imageIndex === imageCourrante )
    }
    if (cadre.etat.imageIndex < 1) {
        window.requestAnimationFrame(peindre);
    }
}

resetCanvas();
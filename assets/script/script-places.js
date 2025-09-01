// Variables globales
let parametresReservation;
let donneesFilm = null;
let seance = null;
let placesSelectionnees = [];
let affichageSeance;

// Éléments DOM
const conteneurSieges = document.querySelector('.seats-container');
const nbLibres = document.querySelector('.nb-libres');
const boiteInfo = document.querySelector('.info-box');

/**
 * Initialisation au chargement du DOM
 * @param {void} - Aucun paramètre
 * @return {void} - Lance l'initialisation de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    parametresReservation = new ParametresReservation();
    
    chargerEtAfficherDonnees();
});

/**
 * Fonction principale de chargement des données
 * @param {void} - Aucun paramètre
 * @return {Promise<void>} - Charge et affiche les données du film
 */
async function chargerEtAfficherDonnees() {
    try {
        const donneesFilms = await ChargeurDonneesFilms.chargerDonneesFilms();
        
        donneesFilm = donneesFilms.find(film => film.titre === parametresReservation.titreFIlm);
        if (donneesFilm) {
            seance = donneesFilm.séances.find(s => s.horaire === parametresReservation.horaireSeance);
            if (seance) {
                // On garde toutes les infos du film mais seulement la séance correspondante
                donneesFilm = { ...donneesFilm, séances: [seance] };
                affichageSeance = new AffichageSeance(donneesFilm, seance);
                afficherDetailsSeance();
            }
        }
    } catch (erreur) {
        // Gestion silencieuse des erreurs
    }
}

/**
 * Affiche les détails de la séance (modification pour places)
 * @param {void} - Aucun paramètre
 * @return {void} - Affiche les détails et génère les sièges
 */
function afficherDetailsSeance() {
    affichageSeance.afficherDetailsSeance();
    
    // Modification spécifique pour la page places
    const contenuFilm = document.querySelector('.movie-content');
    if (contenuFilm) {
        const conteneurDetailsFilm = contenuFilm.querySelector('.movie-details-container');
        if (conteneurDetailsFilm) {
            const titre = conteneurDetailsFilm.querySelector('.movie-title');
            if (titre) {
                titre.insertAdjacentHTML('afterend', 
                    '<a href="choisir-une-seance.html" title="Vers la page: choix d\'une scéance" class="btn-primary">Changer de film</a>'
                );
            }
        }
    }
    
    genererSieges();
    mettreAJourBoutonContinuer();
}

/**
 * Génère les sièges de la salle de cinéma
 * @param {void} - Aucun paramètre
 * @return {void} - Crée et affiche les sièges dans le DOM
 */
function genererSieges() {
    if (!conteneurSieges) return;

    // Configuration des sièges - 300 places au total
    const rangees = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    const siegesParRangee = 20;
    const totalSieges = rangees.length * siegesParRangee; // 300 sièges
    const nombreSiegesOccupes = totalSieges - seance.libres;

    // Générer une liste de tous les sièges possibles
    const tousSieges = [];
    rangees.forEach(rangee => {
        for (let i = 1; i <= siegesParRangee; i++) {
            tousSieges.push(`${rangee}${i}`);
        }
    });

    // Sélectionner aléatoirement les sièges occupés
    const siegesMelanges = [...tousSieges].sort(() => Math.random() - 0.5);
    const siegesIndisponibles = siegesMelanges.slice(0, nombreSiegesOccupes);

    // Initialiser placesSelectionnees avec les places des paramètres URL
    placesSelectionnees = [...parametresReservation.placesSelectionnees];

    rangees.forEach(rangee => {
        const divRangee = document.createElement('div');
        divRangee.className = 'seat-row';
        divRangee.innerHTML = `<span class="row-label">${rangee}</span>`;

        for (let i = 1; i <= siegesParRangee; i++) {
            const idSiege = `${rangee}${i}`;
            const siege = document.createElement('button');
            siege.className = 'seat';
            siege.dataset.seatId = idSiege;
            siege.setAttribute('aria-label', `Siège ${idSiege}`);

            // État des sièges
            if (siegesIndisponibles.includes(idSiege)) {
                siege.classList.add('unavailable');
                siege.disabled = true;
            } else {
                siege.classList.add('available');
                siege.addEventListener('click', () => selectionnerSiege(idSiege, siege));
                
                // Pré-sélectionner les sièges déjà choisis
                if (placesSelectionnees.includes(idSiege)) {
                    siege.classList.remove('available');
                    siege.classList.add('selected');
                }
            }

            // Espaces pour les allées
            if (i === 3 || i === 17) {
                siege.style.marginRight = '20px';
            }

            divRangee.appendChild(siege);
        }

        conteneurSieges.appendChild(divRangee);
    });

    // Ajout de l'écran en dessous des sièges
    const divEcran = document.createElement('div');
    divEcran.className = 'screen';
    divEcran.textContent = 'Écran';
    conteneurSieges.appendChild(divEcran);
    
    // Mettre à jour l'affichage après génération
    mettreAJourBoiteInfo();
}

/**
 * Met à jour le bouton continuer selon l'état de sélection
 * @param {void} - Aucun paramètre
 * @return {void} - Modifie l'état du bouton continuer
 */
function mettreAJourBoutonContinuer() {
    let boutonContinuer = document.querySelector('.btn-continue');

    if (boutonContinuer) {
        boutonContinuer.disabled = placesSelectionnees.length === 0;
        if (placesSelectionnees.length === 0) {
            boutonContinuer.textContent = 'Sélectionnez vos places';
        } else {
            boutonContinuer.innerHTML = `Réserver mes : ${placesSelectionnees.length} place${placesSelectionnees.length > 1 ? 's' : ''} <img src="../assets/images/pictos/fleche-droite.png" alt="Picto flèche vers la droite">`;
        }
    }

    // Mise à jour du nombre de places libres
    if (nbLibres) {
        const siegesDisponibles = conteneurSieges.querySelectorAll('.seat-row .seat.available').length;
        nbLibres.textContent = `Places disponibles : ${siegesDisponibles}`;
    }

    // Gestionnaire pour le bouton continuer
    if (boutonContinuer) {
        // Remove previous click listeners by replacing the button with a clone
        const nouveauBouton = boutonContinuer.cloneNode(true);
        boutonContinuer.parentNode.replaceChild(nouveauBouton, boutonContinuer);

        nouveauBouton.addEventListener('click', () => {
            if (placesSelectionnees.length > 0) {
                // Rediriger vers la page tarifs avec les données
                const parametres = new URLSearchParams({
                    film: parametresReservation.titreFIlm,
                    horaire: parametresReservation.horaireSeance,
                    places: placesSelectionnees.join(',')
                });
                window.location.href = `tarifs.html?${parametres.toString()}`;
            }
        });
    }
}

/**
 * Met à jour la boîte d'information des places sélectionnées
 * @param {void} - Aucun paramètre
 * @return {void} - Modifie l'affichage des places sélectionnées
 */
function mettreAJourBoiteInfo() {
    if (boiteInfo) {
        if (placesSelectionnees.length === 0) {
            boiteInfo.textContent = 'Aucune place sélectionnée.';
        } else {
            let placesAffichees = placesSelectionnees.slice(0, 4);
            let nombreExtra = placesSelectionnees.length - 4;
            boiteInfo.textContent = `Places sélectionnées : ${placesAffichees.join(', ')}${nombreExtra > 0 ? ' ...' : ''}`;
        }
    }
}

/**
 * Sélectionne ou désélectionne un siège
 * @param {string} idSiege - Identifiant du siège (ex: "A1")
 * @param {HTMLElement} elementSiege - Élément DOM du siège
 * @return {void} - Modifie l'état de sélection du siège
 */
function selectionnerSiege(idSiege, elementSiege) {
    if (placesSelectionnees.includes(idSiege)) {
        // Désélectionner
        placesSelectionnees = placesSelectionnees.filter(id => id !== idSiege);
        elementSiege.classList.remove('selected');
        elementSiege.classList.add('available');
    } else {
        // Sélectionner
        placesSelectionnees.push(idSiege);
        elementSiege.classList.remove('available');
        elementSiege.classList.add('selected');
    }
    
    mettreAJourBoutonContinuer();
    mettreAJourBoiteInfo();
}

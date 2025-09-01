// Variables globales
let parametresReservation;
let gestionnaireNavigation;
let affichageSeance;
let donneesFilm = null;
let seance = null;

// Éléments DOM
const selectionBillets = document.querySelector('.ticket-selection');
const sectionTotal = document.querySelector('.total-section');

/**
 * Initialisation au chargement du DOM
 * @param {void} - Aucun paramètre
 * @return {void} - Lance l'initialisation de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    parametresReservation = new ParametresReservation();
    gestionnaireNavigation = new GestionnaireNavigation(parametresReservation);
    
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
                affichageSeance = new AffichageSeance(donneesFilm, seance);
                affichageSeance.afficherDetailsSeance();
                gestionnaireNavigation.mettreAJourLiensNavigation();
                genererSelectionBillets();
                mettreAJourTotal();
            }
        }
    } catch (erreur) {
        // Gestion silencieuse des erreurs
    }
}

/**
 * Génère la sélection des billets
 * @param {void} - Aucun paramètre
 * @return {void} - Crée et affiche la sélection de billets dans le DOM
 */
function genererSelectionBillets() {
    if (!selectionBillets) return;
    
    selectionBillets.innerHTML = `
        <div class="cinepass-promo">
            <img src="../assets/images/pictos/cine-pass.png" alt="Picto du CinéPass" class="cinepass-logo">
            <span>Ajoutez votre CinéPass ou code promo...</span>
            <button class="btn-primary">Ajouter</button>
        </div>
        
        <div class="ticket-types">
            <div class="ticket-type">
                <span class="ticket-label">Matin</span>
                <div class="ticket-controls">
                    <button class="btn-icon decrease" data-type="adulte"><img src="../assets/images/pictos/bouton-moins.png" alt="Picto d'un bouton moins"></button>
                    <span class="ticket-count" data-type="adulte">${parametresReservation.compteursBillets.adulte}</span>
                    <button class="btn-icon increase" data-type="adulte"><img src="../assets/images/pictos/bouton-plus.png" alt="Picto d'un bouton plus"></button>
                </div>
            </div>
            
            <div class="ticket-type">
                <span class="ticket-label">Moins de 14 ans</span>
                <div class="ticket-controls">
                    <button class="btn-icon decrease" data-type="enfant"><img src="../assets/images/pictos/bouton-moins.png" alt="Picto d'un bouton moins"></button>
                    <span class="ticket-count" data-type="enfant">${parametresReservation.compteursBillets.enfant}</span>
                    <button class="btn-icon increase" data-type="enfant"><img src="../assets/images/pictos/bouton-plus.png" alt="Picto d'un bouton plus"></button>
                </div>
            </div>
        </div>
        
        <button class="btn-primary modify-seats">Modifier vos places</button>
    `;
    
    ajouterEcouteursEvenementsBillets();
}

/**
 * Ajoute les événements aux boutons de billets
 * @param {void} - Aucun paramètre
 * @return {void} - Attache les gestionnaires d'événements
 */
function ajouterEcouteursEvenementsBillets() {
    const boutonsAugmenter = document.querySelectorAll('.increase');
    const boutonsDiminuer = document.querySelectorAll('.decrease');
    const boutonModifierPlaces = document.querySelector('.modify-seats');
    
    boutonsAugmenter.forEach(bouton => {
        bouton.addEventListener('click', () => {
            const type = bouton.dataset.type;
            const totalBillets = parametresReservation.compteursBillets.adulte + parametresReservation.compteursBillets.enfant;
            
            if (totalBillets < parametresReservation.placesSelectionnees.length) {
                parametresReservation.compteursBillets[type]++;
                mettreAJourAffichageBillets();
                mettreAJourTotal();
            }
        });
    });
    
    boutonsDiminuer.forEach(bouton => {
        bouton.addEventListener('click', () => {
            const type = bouton.dataset.type;
            
            if (parametresReservation.compteursBillets[type] > 0) {
                parametresReservation.compteursBillets[type]--;
                mettreAJourAffichageBillets();
                mettreAJourTotal();
            }
        });
    });
    
    if (boutonModifierPlaces) {
        boutonModifierPlaces.addEventListener('click', () => {
            // Utiliser la méthode correcte pour inclure tous les paramètres
            window.location.href = `vos-places.html?${parametresReservation.obtenirParametresPlaces().toString()}`;
        });
    }
}

/**
 * Met à jour l'affichage des compteurs de billets
 * @param {void} - Aucun paramètre
 * @return {void} - Modifie l'affichage des compteurs dans le DOM
 */
function mettreAJourAffichageBillets() {
    const elementCompteurAdulte = document.querySelector('.ticket-count[data-type="adulte"]');
    const elementCompteurEnfant = document.querySelector('.ticket-count[data-type="enfant"]');
    
    if (elementCompteurAdulte) elementCompteurAdulte.textContent = parametresReservation.compteursBillets.adulte;
    if (elementCompteurEnfant) elementCompteurEnfant.textContent = parametresReservation.compteursBillets.enfant;
}

/**
 * Met à jour l'affichage du total
 * @param {void} - Aucun paramètre
 * @return {void} - Modifie l'affichage du récapitulatif et du total
 */
function mettreAJourTotal() {
    if (!sectionTotal) return;
    
    const recapitulatifCommande = new RecapitulatifCommande(parametresReservation.compteursBillets);
    const totalBillets = parametresReservation.compteursBillets.adulte + parametresReservation.compteursBillets.enfant;
    const prixTotal = recapitulatifCommande.obtenirPrixTotal();
    
    sectionTotal.innerHTML = `
        <h3>Mes tarifs</h3>
        <div class="summary">
            ${recapitulatifCommande.obtenirHtmlRecapitulatifBillets()}
        </div>
        
        <div class="total-cta">
            <div class="total-line">
                <span>Total à régler</span>
                <span class="total-price">${prixTotal.toFixed(2)}€</span>
            </div>

            <button class="btn-continue ${totalBillets === parametresReservation.placesSelectionnees.length && totalBillets > 0 ? 'enabled' : 'disabled'}" 
                    ${totalBillets === parametresReservation.placesSelectionnees.length && totalBillets > 0 ? '' : 'disabled'}>
                ${totalBillets === parametresReservation.placesSelectionnees.length && totalBillets > 0 ? 'Continuer' : `Sélectionnez ${parametresReservation.placesSelectionnees.length} billet${parametresReservation.placesSelectionnees.length > 1 ? 's' : ''}`}
                ${totalBillets === parametresReservation.placesSelectionnees.length && totalBillets > 0 ? '<img src="../assets/images/pictos/fleche-droite.png" alt="Picto flèche vers la droite">' : ''}
            </button>
        </div>
    `;

    // Ajouter l'événement au bouton continuer
    const boutonContinuer = document.querySelector('.btn-continue');
    if (boutonContinuer && !boutonContinuer.disabled) {
        boutonContinuer.addEventListener('click', () => {
            const parametres = new URLSearchParams({
                film: parametresReservation.titreFIlm,
                horaire: parametresReservation.horaireSeance,
                places: parametresReservation.placesSelectionnees.join(','),
                adult: parametresReservation.compteursBillets.adulte,
                child: parametresReservation.compteursBillets.enfant,
                total: prixTotal.toFixed(2)
            });
            window.location.href = `snacks.html?${parametres.toString()}`;
        });
    }
}
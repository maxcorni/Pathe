// Variables globales
let parametresReservation;
let gestionnaireNavigation;
let affichageSeance;
let donneesFilm = null;
let seance = null;
let donneesSnacks = [];
let compteursSnacks = {};

// Éléments DOM
const selectionSnacks = document.querySelector('.snacks-selection');
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
 * @return {Promise<void>} - Charge et affiche les données du film et des snacks
 */
async function chargerEtAfficherDonnees() {
    try {
        const [donneesFilms, reponseSnacks] = await Promise.all([
            ChargeurDonneesFilms.chargerDonneesFilms(),
            ChargeurDonneesFilms.chargerDonneesSnacks()
        ]);
        
        donneesFilm = donneesFilms.find(film => film.titre === parametresReservation.titreFIlm);
        if (donneesFilm) {
            seance = donneesFilm.séances.find(s => s.horaire === parametresReservation.horaireSeance);
            if (seance) {
                affichageSeance = new AffichageSeance(donneesFilm, seance);
                affichageSeance.afficherDetailsSeance();
                gestionnaireNavigation.mettreAJourLiensNavigation();
                genererSelectionSnacks(reponseSnacks);
                mettreAJourTotal();
            }
        }
    } catch (erreur) {
        // Gestion silencieuse des erreurs
    }
}

/**
 * Génère la sélection des snacks
 * @param {Object} donneesSnacksRaw - Données brutes des snacks organisées par catégorie
 * @return {void} - Crée et affiche la sélection de snacks dans le DOM
 */
function genererSelectionSnacks(donneesSnacksRaw) {
    donneesSnacks = donneesSnacksRaw;
    
    if (!selectionSnacks) return;
    
    // Initialiser les compteurs de snacks avec les données des paramètres URL
    Object.keys(donneesSnacksRaw).forEach(categorie => {
        donneesSnacksRaw[categorie].forEach((snack, index) => {
            const idSnack = `${categorie}_${index}`;
            // Utiliser les données des paramètres URL si disponibles
            compteursSnacks[idSnack] = parametresReservation.compteursSnacks[idSnack] || 0;
        });
    });
    
    selectionSnacks.innerHTML = `
        ${Object.keys(donneesSnacksRaw).map(nomCategorie => `
            <div class="snacks-categorie">
                <h3 class="categorie-title">${nomCategorie}</h3>
                <div class="snacks-grid">
                    ${donneesSnacksRaw[nomCategorie].map((snack, index) => {
                        const idSnack = `${nomCategorie}_${index}`;
                        return `
                            <article class="snacks-card">
                                <img src="../assets/images/snacks/${snack.image}" alt="Image du snacks: ${snack.nom}" class="snack-image">
                                <div class="snacks-info">
                                    <h4 class="snacks-name">${snack.nom}</h4>
                                    <div class="snacks-texte">
                                        <p class="snacks-price">${snack.prix.toFixed(2)}€</p>
                                        <div class="snacks-controls">
                                            <button class="btn-icon small decrease" data-type="${idSnack}" aria-label="Diminuer la quantité de ${snack.nom}"><img src="../assets/images/pictos/bouton-moins.png" alt="Picto d'un bouton moins"></button>
                                            <span class="snack-count" data-type="${idSnack}" aria-label="Quantité: ${compteursSnacks[idSnack]}">${compteursSnacks[idSnack]}</span>
                                            <button class="btn-icon small increase" data-type="${idSnack}" aria-label="Augmenter la quantité de ${snack.nom}"><img src="../assets/images/pictos/bouton-plus.png" alt="Picto d'un bouton plus"></button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('')}
    `;
    
    ajouterEcouteursEvenementsSnacks();
}

/**
 * Trouve l'élément snack correspondant à un ID
 * @param {string} idSnack - Identifiant du snack (ex: "boissons_0")
 * @return {HTMLElement|null} - Élément DOM de la carte snack ou null
 */
function trouverElementSnack(idSnack) {
    const boutonAugmenter = document.querySelector(`.snacks-controls .increase[data-type="${idSnack}"]`);
    return boutonAugmenter ? boutonAugmenter.closest('.snacks-card') : null;
}

/**
 * Ajoute les événements aux boutons de snacks
 * @param {void} - Aucun paramètre
 * @return {void} - Attache les gestionnaires d'événements
 */
function ajouterEcouteursEvenementsSnacks() {
    const boutonsAugmenter = document.querySelectorAll('.snacks-controls .increase');
    const boutonsDiminuer = document.querySelectorAll('.snacks-controls .decrease');
    
    boutonsAugmenter.forEach(bouton => {
        bouton.addEventListener('click', () => {
            const idSnack = bouton.dataset.type;
            const [nomCategorie, index] = idSnack.split('_');
            const donneesSnack = donneesSnacks[nomCategorie] && donneesSnacks[nomCategorie][parseInt(index)];
            
            if (donneesSnack) {
                // Trouver l'élément de la carte snack
                const carteSnack = bouton.closest('.snacks-card');
                
                // Déclencher l'animation d'ajout au panier (fonction définie dans script-animations.js)
                createCartAnimation(carteSnack, donneesSnack);
            }
            
            compteursSnacks[idSnack]++;
            mettreAJourAffichageSnack(idSnack);
            mettreAJourTotal();
        });
    });
    
    boutonsDiminuer.forEach(bouton => {
        bouton.addEventListener('click', () => {
            const idSnack = bouton.dataset.type;
            
            if (compteursSnacks[idSnack] > 0) {
                // Déclencher l'animation de suppression
                const [nomCategorie, index] = idSnack.split('_');
                const donneesSnack = donneesSnacks[nomCategorie] && donneesSnacks[nomCategorie][parseInt(index)];
                const elementSnack = trouverElementSnack(idSnack);
                
                if (donneesSnack) {
                    // Utiliser la fonction définie dans script-animations.js
                    createRemoveAnimation(elementSnack, donneesSnack);
                }
                
                compteursSnacks[idSnack]--;
                mettreAJourAffichageSnack(idSnack);
                mettreAJourTotal();
            }
        });
    });
}

/**
 * Met à jour l'affichage d'un snack spécifique
 * @param {string} idSnack - Identifiant du snack
 * @return {void} - Modifie l'affichage du compteur dans le DOM
 */
function mettreAJourAffichageSnack(idSnack) {
    const elementCompteur = document.querySelector(`.snack-count[data-type="${idSnack}"]`);
    if (elementCompteur) {
        elementCompteur.textContent = compteursSnacks[idSnack];
        
        // Animation du compteur
        elementCompteur.classList.add('snack-count-animated');
        setTimeout(() => {
            elementCompteur.classList.remove('snack-count-animated');
        }, 400);
    }
}

/**
 * Met à jour l'affichage du total
 * @param {void} - Aucun paramètre
 * @return {void} - Modifie l'affichage du récapitulatif et du total
 */
function mettreAJourTotal() {
    if (!sectionTotal) return;
    
    const recapitulatifCommande = new RecapitulatifCommande(parametresReservation.compteursBillets, compteursSnacks, donneesSnacks);
    const prixTotal = recapitulatifCommande.obtenirPrixTotal();
    
    sectionTotal.innerHTML = `
        <h3>Mes tarifs</h3>
        <div class="summary">
            ${recapitulatifCommande.obtenirHtmlRecapitulatifBillets()}
            ${recapitulatifCommande.obtenirHtmlRecapitulatifSnacks(true)}
        </div>
        
        <div class="total-cta">
            <div class="total-line">
                <span>Total à régler</span>
                <span class="total-price">${prixTotal.toFixed(2)}€</span>
            </div>

            <button class="btn-continue enabled">
                Continuer <img src="../assets/images/pictos/fleche-droite.png" alt="Flèche">
            </button>
        </div>
    `;
    
    // Ajouter les événements aux boutons de suppression
    const boutonsPoubelle = document.querySelectorAll('.trash');
    boutonsPoubelle.forEach(bouton => {
        const idSnack = bouton.dataset.type;
        bouton.addEventListener('click', () => {
            // Déclencher l'animation de suppression pour tous les items
            const [nomCategorie, index] = idSnack.split('_');
            const donneesSnack = donneesSnacks[nomCategorie] && donneesSnacks[nomCategorie][parseInt(index)];
            const elementSnack = trouverElementSnack(idSnack);
            const quantite = compteursSnacks[idSnack];
            
            if (donneesSnack && quantite > 0) {
                // Créer plusieurs animations pour représenter tous les items supprimés
                for (let i = 0; i < Math.min(quantite, 5); i++) {
                    setTimeout(() => {
                        // Utiliser la fonction définie dans script-animations.js
                        createRemoveAnimation(elementSnack, donneesSnack);
                    }, i * 100);
                }
            }
            
            compteursSnacks[idSnack] = 0;
            mettreAJourAffichageSnack(idSnack);
            mettreAJourTotal();
        });
    });

    // Ajouter l'événement au bouton continuer
    const boutonContinuer = document.querySelector('.btn-continue');
    if (boutonContinuer) {
        boutonContinuer.addEventListener('click', () => {
            const parametres = new URLSearchParams({
                film: parametresReservation.titreFIlm,
                horaire: parametresReservation.horaireSeance,
                places: parametresReservation.placesSelectionnees.join(','),
                adult: parametresReservation.compteursBillets.adulte,
                child: parametresReservation.compteursBillets.enfant,
                snacks: JSON.stringify(compteursSnacks),
                total: prixTotal.toFixed(2)
            });
            window.location.href = `paiement.html?${parametres.toString()}`;
        });
    }
}
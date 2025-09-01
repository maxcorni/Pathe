// Variables globales
let parametresReservation;
let affichageSeance;
let donneesFilm = null;
let seance = null;
let donneesSnacks = {};

// Éléments DOM
const billet = document.querySelector('.billet');

/**
 * Initialisation au chargement du DOM
 * @param {void} - Aucun paramètre
 * @return {void} - Lance l'initialisation de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    parametresReservation = new ParametresReservation();
    
    if (!verifierTokenSucces()) return;
    
    chargerEtAfficherDonnees();
});

/**
 * Vérifie le token de succès pour sécuriser l'accès à la page
 * @param {void} - Aucun paramètre
 * @return {boolean} - true si l'accès est autorisé, false sinon
 */
function verifierTokenSucces() {
    if (parametresReservation.succes !== 'true') {
        alert('Accès non autorisé. Redirection vers l\'accueil.');
        window.location.href = '../index.html';
        return false;
    }
    
    // Vérification basique : si on a les paramètres nécessaires, c'est valide
    if (!parametresReservation.titreFIlm || !parametresReservation.horaireSeance || !parametresReservation.prixTotal) {
        alert('Données manquantes. Redirection vers l\'accueil.');
        window.location.href = '../index.html';
        return false;
    }
    
    return true;
}

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
        
        donneesSnacks = reponseSnacks;
        
        donneesFilm = donneesFilms.find(film => film.titre === parametresReservation.titreFIlm);
        if (donneesFilm) {
            seance = donneesFilm.séances.find(s => s.horaire === parametresReservation.horaireSeance);
            if (seance) {
                affichageSeance = new AffichageSeance(donneesFilm, seance);
                affichageSeance.afficherDetailsSeance();
                genererBillet();
            }
        }
    } catch (erreur) {
        // Gestion silencieuse des erreurs
    }
}

/**
 * Génère le billet de confirmation avec modal des détails
 * @param {void} - Aucun paramètre
 * @return {void} - Crée et affiche le billet dans le DOM
 */
function genererBillet() {
    if (!billet) return;
    
    const dateActuelle = new Date();
    const recapitulatifCommande = new RecapitulatifCommande(parametresReservation.compteursBillets, parametresReservation.compteursSnacks, donneesSnacks);
    
    billet.innerHTML = `
        <div class="ticket">
            <h3 class="ticket-header">Pathé Lyon Bellecour</h3>
            
            <div class="ticket-body">
                <h2 class="movie-title">${donneesFilm.titre}</h2>
                
                <div class="ticket-info">
                    <p>Séance ${seance.horaire} ${seance.vf ? 'VF' : 'VOSTFR'}</p>
                    <p>Salle ${seance.salle}</p>
                    <p>Siège ${parametresReservation.placesSelectionnees.join(', ')}</p>
                    <p>Total : ${parametresReservation.prixTotal.toFixed(2)} €</p>
                </div>
            </div>
            <div class="qr-section">
                <div class="qr-code">
                    <img src="../assets/images/pictos/qr-code.png" alt="QR Code pour récupérer votre billet" class="qr-image">
                </div>
            </div>
        </div>
    `;
    
    // Créer la modal séparément et l'ajouter au body
    const modal = creerModalDetailsReservation(dateActuelle, recapitulatifCommande);
    document.body.appendChild(modal);
    
    // Ajouter l'événement de clic sur le billet
    const ticket = billet.querySelector('.ticket');
    const boutonFermer = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    ajouterEvenementsModal(ticket, modal, boutonFermer, overlay);
}

/**
 * Crée la modal des détails de réservation
 * @param {Date} dateActuelle - Date actuelle pour l'affichage
 * @param {RecapitulatifCommande} recapitulatifCommande - Instance du récapitulatif
 * @return {HTMLElement} - Élément DOM de la modal
 */
function creerModalDetailsReservation(dateActuelle, recapitulatifCommande) {
    const modal = document.createElement('div');
    modal.className = 'booking-details-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="close-modal" aria-label="Fermer les détails">&times;</button>
            <h3>Détails de la réservation</h3>
            
            <div class="panier-section">
                <h4>Panier</h4>
                <div class="panier-items">
                    ${recapitulatifCommande.obtenirHtmlRecapitulatifBillets()}
                    ${recapitulatifCommande.obtenirHtmlRecapitulatifSnacks(false)}
                </div>
                <div class="info-row">
                    <span><strong>Total :</strong></span>
                    <span><strong>${parametresReservation.prixTotal.toFixed(2)} €</strong></span>
                </div>
            </div>
            
            <div class="booking-info">
                <h4>Informations de réservation</h4>
                <div class="info-row">
                    <span>Film :</span>
                    <span>${donneesFilm.titre}</span>
                </div>
                <div class="info-row">
                    <span>Séance :</span>
                    <span>${seance.horaire} ${seance.vf ? 'VF' : 'VOSTFR'}</span>
                </div>
                <div class="info-row">
                    <span>Salle :</span>
                    <span>${seance.salle}</span>
                </div>
                <div class="info-row">
                    <span>Places :</span>
                    <span>${parametresReservation.placesSelectionnees.join(', ')}</span>
                </div>
                <div class="info-row">
                    <span>Date de réservation :</span>
                    <span>${dateActuelle.toLocaleDateString('fr-FR')} à ${dateActuelle.toLocaleTimeString('fr-FR')}</span>
                </div>
            </div>
            
            <div class="paiement-section">
                <h4>Mode de paiement</h4>
                <div class="paiement-method">
                    ${parametresReservation.typePaiement === 'google Pay' ? 'Google Pay' : 'Carte bancaire'}
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

/**
 * Ajoute les événements à la modal et au billet
 * @param {HTMLElement} ticket - Élément du billet
 * @param {HTMLElement} modal - Élément de la modal
 * @param {HTMLElement} boutonFermer - Bouton de fermeture
 * @param {HTMLElement} overlay - Overlay de la modal
 * @return {void} - Attache les gestionnaires d'événements
 */
function ajouterEvenementsModal(ticket, modal, boutonFermer, overlay) {
    if (ticket) {
        ticket.addEventListener('click', () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus sur le bouton fermer pour l'accessibilité
            if (boutonFermer) {
                boutonFermer.focus();
            }
        });
    }
    
    /**
     * Ferme la modal et restaure l'état de la page
     * @param {void} - Aucun paramètre
     * @return {void} - Ferme la modal et remet le focus
     */
    const fermerModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Remettre le focus sur le billet
        if (ticket) {
            ticket.focus();
        }
    };
    
    if (boutonFermer) {
        boutonFermer.addEventListener('click', fermerModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', fermerModal);
    }
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            fermerModal();
        }
    });
    
    // Support clavier pour le billet
    if (ticket) {
        ticket.setAttribute('tabindex', '0');
        ticket.setAttribute('role', 'button');
        ticket.setAttribute('aria-label', 'Cliquer pour voir les détails de la réservation');
        
        ticket.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                if (boutonFermer) {
                    boutonFermer.focus();
                }
            }
        });
    }
}
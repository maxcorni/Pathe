// Variables globales
let parametresReservation;
let gestionnaireNavigation;
let affichageSeance;
let donneesFilm = null;
let seance = null;
let paiementValide = false;
let typePaiement = 'card';

// Éléments DOM
const sectionPaiement = document.querySelector('.paiement-section');
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
                genererFormulairePaiement();
                mettreAJourTotal();
            }
        }
    } catch (erreur) {
        // Gestion silencieuse des erreurs
    }
}

/**
 * Génère le formulaire de paiement
 * @param {void} - Aucun paramètre
 * @return {void} - Crée et affiche le formulaire de paiement dans le DOM
 */
function genererFormulairePaiement() {
    if (!sectionPaiement) return;
    
    sectionPaiement.innerHTML = `
        <div class="paiement-options" role="radiogroup" aria-labelledby="paiement-legend">
            <legend id="paiement-legend">Choisir mon mode de paiement</legend>
            
            <button class="paiement-option active" data-paiement="card" type="button" role="radio" aria-checked="true">
                <div class="paiement-header">
                    <span>Carte bancaire</span>
                    <div class="card-icons">
                        <img src="../assets/images/pictos/cb.png" alt="Picto Carte Bleue">
                        <img src="../assets/images/pictos/visa.png" alt="Picto Visa">
                        <img src="../assets/images/pictos/mastercard.png" alt="Picto Mastercard">
                        <img src="../assets/images/pictos/amex.png" alt="Picto American Express">
                    </div>
                </div>
                
                <div class="paiement-form">
                    <div class="form-group">
                        <label for="card-number">Numéro de carte *</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" aria-required="true" aria-describedby="card-error">
                        <div class="error-message" id="card-error" style="display: none;" role="alert" aria-live="polite">Numéro de carte invalide</div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry-date">Date d'expiration *</label>
                            <input type="text" id="expiry-date" placeholder="MM/AA" maxlength="5" aria-required="true" aria-describedby="expiry-error">
                            <div class="error-message" id="expiry-error" style="display: none;" role="alert" aria-live="polite">Date d'expiration invalide</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cvv">Cryptogramme *</label>
                            <input type="text" id="cvv" placeholder="123" maxlength="3" aria-required="true" aria-describedby="cvv-error">
                            <div class="error-message" id="cvv-error" style="display: none;" role="alert" aria-live="polite">Cryptogramme invalide</div>
                        </div>
                    </div>
                </div>
            </button>
            
            <button class="paiement-option" data-paiement="google" type="button" role="radio" aria-checked="false">
                <div class="paiement-header">
                    <span>Google Pay</span>
                    <img src="../assets/images/pictos/google-pay.png" alt="Picto Google Pay" class="google-pay-icon">
                </div>
                <div class="google-pay-form" style="display: none;">
                    <div class="google-pay-button" tabindex="0" role="button" aria-label="Payer avec Google Pay">
                        Commander avec <img src="../assets/images/pictos/google-pay.png" alt="Picto Google Pay" class="google-pay-icon" aria-hidden="true">
                    </div>
                </div>
            </button>
        </div>
    `;
    
    ajouterEcouteursEvenementsPaiement();
}

/**
 * Ajoute les événements aux options de paiement
 * @param {void} - Aucun paramètre
 * @return {void} - Attache les gestionnaires d'événements
 */
function ajouterEcouteursEvenementsPaiement() {
    const optionsPaiement = document.querySelectorAll('.paiement-option');
    const champNumeroCarte = document.getElementById('card-number');
    const champDateExpiration = document.getElementById('expiry-date');
    const champCvv = document.getElementById('cvv');
    
    // Gérer la sélection des options de paiement
    optionsPaiement.forEach(option => {
        option.addEventListener('click', () => {
            const etaitActif = option.classList.contains('active');
            
            optionsPaiement.forEach(opt => {
                opt.classList.remove('active');
                // Cacher tous les formulaires
                const formulaireCarte = opt.querySelector('.paiement-form');
                const formulaireGoogle = opt.querySelector('.google-pay-form');
                if (formulaireCarte) formulaireCarte.style.display = 'none';
                if (formulaireGoogle) formulaireGoogle.style.display = 'none';
            });
            
            option.classList.add('active');
            
            // Ne reset la validation que si on change vraiment d'option
            if (!etaitActif) {
                paiementValide = false;
                mettreAJourBoutonContinuer();
            }
            
            // Afficher le formulaire correspondant
            const typePaiementChoisi = option.dataset.paiement;
            if (typePaiementChoisi === 'card') {
                const formulaireCarte = option.querySelector('.paiement-form');
                if (formulaireCarte) formulaireCarte.style.display = 'block';
            } else if (typePaiementChoisi === 'google') {
                const formulaireGoogle = option.querySelector('.google-pay-form');
                if (formulaireGoogle) formulaireGoogle.style.display = 'block';
            }
        });
    });
    
    // Afficher le formulaire de la carte par défaut
    const formulaireCarteParDefaut = document.querySelector('.paiement-option[data-paiement="card"] .paiement-form');
    if (formulaireCarteParDefaut) formulaireCarteParDefaut.style.display = 'block';
    
    // Event listener pour le bouton Google Pay
    const boutonGooglePay = document.querySelector('.google-pay-button');
    if (boutonGooglePay) {
        boutonGooglePay.addEventListener('click', () => {
            if (confirm('Confirmer le paiement avec Google Pay ?')) {
                paiementValide = true;
                mettreAJourBoutonContinuer();
            }
        });
        
        // Support clavier pour le div Google Pay
        boutonGooglePay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (confirm('Confirmer le paiement avec Google Pay ?')) {
                    paiementValide = true;
                    mettreAJourBoutonContinuer();
                }
            }
        });
    }
    
    /**
     * Valide le formulaire de carte en temps réel
     * @param {void} - Aucun paramètre
     * @return {void} - Met à jour l'état de validation
     */
    function validerFormulaireCarte() {
        const numeroCarte = champNumeroCarte ? champNumeroCarte.value.replace(/\s/g, '') : '';
        const dateExpiration = champDateExpiration ? champDateExpiration.value : '';
        const cvv = champCvv ? champCvv.value : '';
        const erreurCarte = document.getElementById('card-error');
        const erreurExpiration = document.getElementById('expiry-error');
        const erreurCvv = document.getElementById('cvv-error');
        
        // Validation: 16 chiffres pour le numéro, MM/YY pour la date, 3 chiffres pour CVV
        const carteValide = numeroCarte.length === 16 && /^\d{16}$/.test(numeroCarte);
        const cvvValide = /^\d{3}$/.test(cvv);
        
        // Afficher/masquer le message d'erreur pour le numéro de carte
        if (erreurCarte) {
            if (numeroCarte.length > 0 && !carteValide) {
                erreurCarte.style.display = 'block';
            } else {
                erreurCarte.style.display = 'none';
            }
        }
        
        // Afficher/masquer le message d'erreur pour le CVV
        if (erreurCvv) {
            if (cvv.length > 0 && cvv.length < 3) {
                erreurCvv.style.display = 'block';
            } else {
                erreurCvv.style.display = 'none';
            }
        }
        
        // Validation améliorée de la date d'expiration
        let expirationValide = false;
        if (/^\d{2}\/\d{2}$/.test(dateExpiration)) {
            const [mois, annee] = dateExpiration.split('/');
            const numeroMois = parseInt(mois, 10);
            const numeroAnnee = parseInt(annee, 10);
            
            // Vérifier que le mois est entre 01 et 12
            const moisValide = numeroMois >= 1 && numeroMois <= 12;
            
            // Vérifier que la date est entre 09/25 et XX/35
            const dateActuelle = new Date(2000 + numeroAnnee, numeroMois - 1);
            const dateMinimale = new Date(2025, 8); // Septembre 2025 (mois 8 car 0-indexé)
            const dateMaximale = new Date(2035, 11); // Décembre 2035
            
            expirationValide = moisValide && dateActuelle >= dateMinimale && dateActuelle <= dateMaximale;
        }
        
        // Afficher/masquer le message d'erreur pour la date d'expiration
        if (erreurExpiration) {
            if (dateExpiration.length > 0 && (dateExpiration.length < 5 || !expirationValide)) {
                erreurExpiration.style.display = 'block';
            } else {
                erreurExpiration.style.display = 'none';
            }
        }
        
        const paiementActif = document.querySelector('.paiement-option.active');
        if (paiementActif?.dataset.paiement === 'card') {
            paiementValide = carteValide && expirationValide && cvvValide;
            mettreAJourBoutonContinuer();
        }
    }
    
    // Formatage automatique du numéro de carte avec validation
    if (champNumeroCarte) {
        champNumeroCarte.addEventListener('input', (e) => {
            let valeur = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            // Limiter à 16 chiffres
            valeur = valeur.substring(0, 16);
            let valeurFormatee = valeur.match(/.{1,4}/g)?.join(' ') || valeur;
            e.target.value = valeurFormatee;
            validerFormulaireCarte();
        });
    }
    
    // Formatage automatique de la date d'expiration avec validation
    if (champDateExpiration) {
        champDateExpiration.addEventListener('input', (e) => {
            let valeur = e.target.value.replace(/\D/g, '');
            if (valeur.length >= 2) {
                valeur = valeur.substring(0, 2) + '/' + valeur.substring(2, 4);
            }
            e.target.value = valeur;
            validerFormulaireCarte();
        });
    }
    
    // Validation CVV avec limitation à 3 chiffres
    if (champCvv) {
        champCvv.addEventListener('input', (e) => {
            let valeur = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = valeur.substring(0, 3);
            validerFormulaireCarte();
        });
    }
}

/**
 * Met à jour l'état du bouton continuer
 * @param {void} - Aucun paramètre
 * @return {void} - Active ou désactive le bouton selon la validation
 */
function mettreAJourBoutonContinuer() {
    const boutonContinuer = document.querySelector('.btn-continue');
    
    if (boutonContinuer) {
        if (paiementValide) {
            boutonContinuer.classList.add('enabled');
            boutonContinuer.classList.remove('disabled');
            boutonContinuer.disabled = false;
        } else {
            boutonContinuer.classList.remove('enabled');
            boutonContinuer.classList.add('disabled');
            boutonContinuer.disabled = true;
        }
    }
}

/**
 * Met à jour l'affichage du total et configure le bouton de paiement
 * @param {void} - Aucun paramètre
 * @return {void} - Modifie l'affichage du total et ajoute les événements
 */
function mettreAJourTotal() {
    if (!sectionTotal) return;
    
    sectionTotal.innerHTML = `
        <div class="total-cta">
            <div class="total-line">
                <span>Total à régler</span>
                <span class="total-price">${parametresReservation.prixTotal.toFixed(2)} €</span>
            </div>

            <button class="btn-continue disabled" disabled>
                Continuer <img src="../assets/images/pictos/fleche-droite.png" alt="Picto flèche vers la droite">
            </button>
        </div>
    `;
    
    // Ajouter l'événement au bouton continuer
    const boutonContinuer = document.querySelector('.btn-continue');
    if (boutonContinuer) {
        boutonContinuer.addEventListener('click', () => {
            if (!paiementValide) return;

            const optionCarte = document.querySelector('.paiement-option[data-paiement="card"]');
            typePaiement = (optionCarte && optionCarte.classList.contains('active')) ? 'card' : 'google Pay';
                        
            const parametres = new URLSearchParams({
                success: 'true',
                film: parametresReservation.titreFIlm,
                horaire: parametresReservation.horaireSeance,
                places: parametresReservation.placesSelectionnees.join(','),
                adult: parametresReservation.compteursBillets.adulte,
                child: parametresReservation.compteursBillets.enfant,
                snacks: JSON.stringify(parametresReservation.compteursSnacks),
                total: parametresReservation.prixTotal.toFixed(2),
                paiement: typePaiement
            });
            window.location.href = `confirmation.html?${parametres.toString()}`;
        });
    }
}
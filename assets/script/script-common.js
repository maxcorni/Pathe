/**
 * Utilitaires communs pour l'application Pathé
 */

// Configuration globale
const PRIX_BILLETS = {
    adulte: 9.90,
    enfant: 6.50
};

/**
 * Classe pour gérer les paramètres URL de réservation
 */
class ParametresReservation {
    /**
     * Constructeur - Initialise les paramètres à partir de l'URL
     * @param {void} - Aucun paramètre
     * @return {ParametresReservation} - Instance de la classe
     */
    constructor() {
        const parametresUrl = new URLSearchParams(window.location.search);
        this.titreFIlm = parametresUrl.get('film');
        this.horaireSeance = parametresUrl.get('horaire');
        this.placesSelectionnees = parametresUrl.get('places') ? parametresUrl.get('places').split(',') : [];
        
        // Initialiser les comptes de billets
        const parametreAdulte = parametresUrl.get('adult');
        const parametreEnfant = parametresUrl.get('child');
        
        this.compteursBillets = {
            adulte: parseInt(parametreAdulte) || 0,
            enfant: parseInt(parametreEnfant) || 0
        };
        
        // Si aucun billet spécifié et qu'on a des places, initialiser avec adulte = nombre de places
        if (this.compteursBillets.adulte === 0 && this.compteursBillets.enfant === 0 && this.placesSelectionnees.length > 0) {
            this.compteursBillets.adulte = this.placesSelectionnees.length;
        }
        
        // Parse données snacks
        this.compteursSnacks = {};
        const parametreSnacks = parametresUrl.get('snacks');
        if (parametreSnacks) {
            try {
                const snacksParsés = JSON.parse(parametreSnacks);
                Object.keys(snacksParsés).forEach(cle => {
                    this.compteursSnacks[cle] = parseInt(snacksParsés[cle], 10);
                });
            } catch (e) {
                // Gestion silencieuse des erreurs
            }
        }
        
        this.prixTotal = parseFloat(parametresUrl.get('total')) || 0;
        this.typePaiement = parametresUrl.get('paiement') || 'card';
        this.succes = parametresUrl.get('success');
    }
    
    /**
     * Génère les paramètres URL pour la page places
     * @param {void} - Aucun paramètre
     * @return {URLSearchParams} - Paramètres formatés pour l'URL
     */
    obtenirParametresPlaces() {
        const parametres = new URLSearchParams({
            film: this.titreFIlm,
            horaire: this.horaireSeance
        });
        
        // Ajouter les places si elles existent
        if (this.placesSelectionnees.length > 0) {
            parametres.set('places', this.placesSelectionnees.join(','));
        }
        
        // Ajouter les billets si ils existent
        if (this.compteursBillets.adulte > 0) {
            parametres.set('adult', this.compteursBillets.adulte);
        }
        if (this.compteursBillets.enfant > 0) {
            parametres.set('child', this.compteursBillets.enfant);
        }
        
        return parametres;
    }
    
    /**
     * Génère les paramètres URL pour la page tarifs
     * @param {void} - Aucun paramètre
     * @return {URLSearchParams} - Paramètres formatés pour l'URL
     */
    obtenirParametresTarifs() {
        const parametres = new URLSearchParams({
            film: this.titreFIlm,
            horaire: this.horaireSeance,
            places: this.placesSelectionnees.join(',')
        });
        
        // Ajouter les billets si ils existent
        if (this.compteursBillets.adulte > 0) {
            parametres.set('adult', this.compteursBillets.adulte);
        }
        if (this.compteursBillets.enfant > 0) {
            parametres.set('child', this.compteursBillets.enfant);
        }
        
        return parametres;
    }
    
    /**
     * Génère les paramètres URL pour la page snacks
     * @param {void} - Aucun paramètre
     * @return {URLSearchParams} - Paramètres formatés pour l'URL
     */
    obtenirParametresSnacks() {
        const parametres = new URLSearchParams({
            film: this.titreFIlm,
            horaire: this.horaireSeance,
            places: this.placesSelectionnees.join(','),
            adult: this.compteursBillets.adulte,
            child: this.compteursBillets.enfant
        });
        
        // Ajouter les snacks si ils existent
        if (Object.keys(this.compteursSnacks).length > 0) {
            parametres.set('snacks', JSON.stringify(this.compteursSnacks));
        }
        
        return parametres;
    }
    
    /**
     * Génère les paramètres URL pour la page paiement
     * @param {void} - Aucun paramètre
     * @return {URLSearchParams} - Paramètres formatés pour l'URL
     */
    obtenirParametresPaiement() {
        return new URLSearchParams({
            film: this.titreFIlm,
            horaire: this.horaireSeance,
            places: this.placesSelectionnees.join(','),
            adult: this.compteursBillets.adulte,
            child: this.compteursBillets.enfant,
            snacks: JSON.stringify(this.compteursSnacks),
            total: this.prixTotal.toFixed(2)
        });
    }
}

/**
 * Classe pour gérer l'affichage des détails de séance
 */
class AffichageSeance {
    /**
     * Constructeur - Initialise l'affichage avec les données du film et de la séance
     * @param {Object} donneesFilm - Données complètes du film
     * @param {Object} seance - Données de la séance spécifique
     * @return {AffichageSeance} - Instance de la classe
     */
    constructor(donneesFilm, seance) {
        this.donneesFilm = donneesFilm;
        this.seance = seance;
    }
    
    /**
     * Affiche les détails de la séance dans la sidebar
     * @param {void} - Aucun paramètre
     * @return {void} - Modifie le DOM
     */
    afficherDetailsSeance() {
        const salle = document.querySelector('.salle');
        const barreLatérale = document.querySelector('.side-bar');
        const contenuFilm = document.querySelector('.movie-content');
        
        if (salle) {
            salle.innerHTML = `Salle ${this.seance.salle} ${this.seance.handicap ? "<img src='assets/images/pictos/desactive-black.png' style='width: 16px; height: 16px' alt='Picto d'une personne en chaise roulante'>" : ""}`;
        }

        if (barreLatérale) {
            barreLatérale.style.backgroundImage = `linear-gradient(rgba(28,33,41,0.83), rgba(28,33,41,0.83)), url('assets/images/films/${this.donneesFilm.image}')`;
        }
        
        if (contenuFilm) {
            contenuFilm.innerHTML = this.obtenirHtmlContenuFilm();
        }
    }
    
    /**
     * Génère le HTML du contenu du film
     * @param {void} - Aucun paramètre
     * @return {string} - HTML formaté pour l'affichage
     */
    obtenirHtmlContenuFilm() {
        return `
            <img src="../assets/images/pictos/logo-international-white.png" alt="Logo de pathé" class="pathe-logo">
            <img src="../assets/images/films/${this.donneesFilm.image}" alt="Image du film: ${this.donneesFilm.titre}" class="movie-poster">
            <div class="movie-details-container">
                <h2 class="movie-title">${this.donneesFilm.titre}</h2>
                <div class="movie-details">
                    <span class="seance">Seance</span>
                    <div class="seance-info">
                        <div class="top">
                            <span class="horaire">${this.seance.horaire}</span>
                            ${this.seance.vf ? '<span class="langue">VF</span>' : ''}
                            ${this.seance.vost ? '<span class="langue">VOSTFR</span>' : ''}
                        </div>
                        <span class="bot">Fin prévu à ${this.seance.fin}</span>
                    </div>
                </div>
                <div class="salle-info">
                    ${this.seance.imax ? '<span class="tech">IMAX</span>' : ''}
                    ${this.seance['4k'] ? '<span class="tech">4K</span>' : ''}
                    ${this.seance['4D'] ? '<span class="tech">4D</span>' : ''}
                </div>
            </div>
        `;
    }
}

/**
 * Classe pour gérer la navigation entre les pages
 */
class GestionnaireNavigation {
    /**
     * Constructeur - Initialise le gestionnaire avec les paramètres de réservation
     * @param {ParametresReservation} parametresReservation - Instance des paramètres
     * @return {GestionnaireNavigation} - Instance de la classe
     */
    constructor(parametresReservation) {
        this.parametres = parametresReservation;
    }
    
    /**
     * Met à jour tous les liens de navigation
     * @param {void} - Aucun paramètre
     * @return {void} - Modifie les liens dans le DOM
     */
    mettreAJourLiensNavigation() {
        this.mettreAJourLiensRetour();
        this.mettreAJourLiensNav();
    }
    
    /**
     * Met à jour les liens de retour
     * @param {void} - Aucun paramètre
     * @return {void} - Modifie les liens de retour dans le DOM
     */
    mettreAJourLiensRetour() {
        const retourPlaces = document.getElementById('retour-places');
        const retourTarifs = document.getElementById('retour-tarifs');
        const retourSnacks = document.getElementById('retour-snacks');
        
        if (retourPlaces) {
            retourPlaces.href = `vos-places.html?${this.parametres.obtenirParametresPlaces().toString()}`;
        }
        
        if (retourTarifs) {
            retourTarifs.href = `tarifs.html?${this.parametres.obtenirParametresTarifs().toString()}`;
        }
        
        if (retourSnacks) {
            retourSnacks.href = `snacks.html?${this.parametres.obtenirParametresSnacks().toString()}`;
        }
    }
    
    /**
     * Met à jour les liens de navigation dans le header
     * @param {void} - Aucun paramètre
     * @return {void} - Modifie les liens de navigation dans le DOM
     */
    mettreAJourLiensNav() {
        const navPlaces = document.getElementById('nav-places');
        const navTarifs = document.getElementById('nav-tarifs');
        const navSnacks = document.getElementById('nav-snacks');
        
        if (navPlaces) {
            navPlaces.href = `vos-places.html?${this.parametres.obtenirParametresPlaces().toString()}`;
        }
        
        if (navTarifs && this.parametres.placesSelectionnees.length > 0) {
            navTarifs.href = `tarifs.html?${this.parametres.obtenirParametresTarifs().toString()}`;
        }
        
        if (navSnacks && this.parametres.placesSelectionnees.length > 0 && (this.parametres.compteursBillets.adulte > 0 || this.parametres.compteursBillets.enfant > 0)) {
            navSnacks.href = `snacks.html?${this.parametres.obtenirParametresSnacks().toString()}`;
        }
    }
}

/**
 * Utilitaire pour charger les données des films
 */
class ChargeurDonneesFilms {
    /**
     * Charge les données des films depuis le fichier JSON
     * @param {void} - Aucun paramètre
     * @return {Promise<Array>} - Promesse contenant les données des films
     */
    static async chargerDonneesFilms() {
        try {
            const reponse = await fetch('assets/json/films.json');
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP! statut: ${reponse.status}`);
            }
            return await reponse.json();
        } catch (erreur) {
            console.error('Erreur lors du chargement des films:', erreur);
            throw erreur;
        }
    }
    
    /**
     * Charge les données des snacks depuis le fichier JSON
     * @param {void} - Aucun paramètre
     * @return {Promise<Object>} - Promesse contenant les données des snacks
     */
    static async chargerDonneesSnacks() {
        try {
            const reponse = await fetch('assets/json/snack.json');
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP! statut: ${reponse.status}`);
            }
            return await reponse.json();
        } catch (erreur) {
            console.error('Erreur lors du chargement des snacks:', erreur);
            throw erreur;
        }
    }
}

/**
 * Classe pour gérer l'affichage du total et du récapitulatif
 */
class RecapitulatifCommande {
    /**
     * Constructeur - Initialise le récapitulatif avec les compteurs
     * @param {Object} compteursBillets - Compteurs des billets {adulte: number, enfant: number}
     * @param {Object} compteursSnacks - Compteurs des snacks {id: quantity}
     * @param {Object} donneesSnacks - Données complètes des snacks
     * @return {RecapitulatifCommande} - Instance de la classe
     */
    constructor(compteursBillets, compteursSnacks = {}, donneesSnacks = {}) {
        this.compteursBillets = compteursBillets;
        this.compteursSnacks = compteursSnacks;
        this.donneesSnacks = donneesSnacks;
    }
    
    /**
     * Calcule le prix total des billets
     * @param {void} - Aucun paramètre
     * @return {number} - Prix total des billets
     */
    obtenirPrixBillets() {
        return (this.compteursBillets.adulte * PRIX_BILLETS.adulte) + 
               (this.compteursBillets.enfant * PRIX_BILLETS.enfant);
    }
    
    /**
     * Calcule le prix total des snacks
     * @param {void} - Aucun paramètre
     * @return {number} - Prix total des snacks
     */
    obtenirPrixSnacks() {
        let total = 0;
        Object.keys(this.compteursSnacks).forEach(idSnack => {
            const quantite = this.compteursSnacks[idSnack];
            if (quantite > 0) {
                const [nomCategorie, index] = idSnack.split('_');
                const snack = this.donneesSnacks[nomCategorie] && this.donneesSnacks[nomCategorie][parseInt(index)];
                if (snack) {
                    total += quantite * snack.prix;
                }
            }
        });
        return total;
    }
    
    /**
     * Génère le HTML du récapitulatif des billets
     * @param {void} - Aucun paramètre
     * @return {string} - HTML formaté pour l'affichage
     */
    obtenirHtmlRecapitulatifBillets() {
        let html = '';
        if (this.compteursBillets.adulte > 0) {
            html += `<div class="summary-line">
                <p>${this.compteursBillets.adulte}x <span class="medium">Matin</span></p>
                <p>${(this.compteursBillets.adulte * PRIX_BILLETS.adulte).toFixed(2)}€</p>
            </div>`;
        }
        if (this.compteursBillets.enfant > 0) {
            html += `<div class="summary-line">
                <p>${this.compteursBillets.enfant}x <span class="medium">Moins de 14 ans</span></p>
                <p>${(this.compteursBillets.enfant * PRIX_BILLETS.enfant).toFixed(2)}€</p>
            </div>`;
        }
        return html;
    }
    
    /**
     * Génère le HTML du récapitulatif des snacks
     * @param {boolean} inclurePoubelle - Inclure les boutons de suppression
     * @return {string} - HTML formaté pour l'affichage
     */
    obtenirHtmlRecapitulatifSnacks(inclurePoubelle = false) {
        let html = '';
        Object.keys(this.compteursSnacks).forEach(idSnack => {
            const quantite = this.compteursSnacks[idSnack];
            if (quantite > 0) {
                const [nomCategorie, index] = idSnack.split('_');
                const snack = this.donneesSnacks[nomCategorie] && this.donneesSnacks[nomCategorie][parseInt(index)];
                if (snack) {
                    const totalSnack = quantite * snack.prix;
                    html += `<div class="summary-line">
                        <p>${quantite}x <span class="medium">${snack.nom}</span></p>
                        ${inclurePoubelle ? `<div class="snack-total-and-trash">
                            <p>${totalSnack.toFixed(2)}€</p>
                            <button class="btn-icon small trash" data-type="${idSnack}"><img src="../assets/images/pictos/poubelle.png" alt="Picto d'une poubelle"></button>
                        </div>` : `<p>${totalSnack.toFixed(2)}€</p>`}
                    </div>`;
                }
            }
        });
        return html;
    }
    
    /**
     * Calcule le prix total
     * @param {void} - Aucun paramètre
     * @return {number} - Prix total de la commande
     */
    obtenirPrixTotal() {
        return this.obtenirPrixBillets() + this.obtenirPrixSnacks();
    }
}

// Export des classes pour une utilisation modulaire
window.ParametresReservation = ParametresReservation;
window.AffichageSeance = AffichageSeance;
window.GestionnaireNavigation = GestionnaireNavigation;
window.ChargeurDonneesFilms = ChargeurDonneesFilms;
window.RecapitulatifCommande = RecapitulatifCommande;
window.PRIX_BILLETS = PRIX_BILLETS;

// Variables globales
let donneesFilms = [];

// Éléments DOM
const selecteurGenre = document.getElementById('genre-select');
const selecteurSalle = document.getElementById('salle-select');
const selecteurLangue = document.getElementById('langue-select');
const champRecherche = document.getElementById('search-input');
const conteneurFilms = document.getElementById('films-container');

/**
 * Filtre les films selon les critères sélectionnés
 * @param {void} - Aucun paramètre
 * @return {void} - Met à jour l'affichage des films filtrés
 */
function filtrerFilms() {
    // Vérifier si les données sont chargées
    if (!donneesFilms.length) return;

    const genre = selecteurGenre.value;
    const salle = selecteurSalle.value;
    const langue = selecteurLangue.value;
    const recherche = champRecherche.value.toLowerCase();

    const filmsFiltres = donneesFilms.filter(film => {
        // Genre
        const correspondanceGenre = !genre || film.genre.includes(genre);

        // Recherche
        const correspondanceRecherche = film.titre.toLowerCase().includes(recherche);

        // Séances filtrées
        const seancesFiltrees = film.séances.filter(s => {
            // Salle
            const correspondanceSalle = !salle || s[salle] === true;
            // Langue
            let correspondanceLangue = true;
            if (langue === 'vf') correspondanceLangue = s.vf === true;
            if (langue === 'vost') correspondanceLangue = s.vost === true;
            return correspondanceSalle && correspondanceLangue;
        });

        return correspondanceGenre && correspondanceRecherche && seancesFiltrees.length > 0;
    });

    afficherFilms(filmsFiltres);
}

/**
 * Affiche la liste des films dans le conteneur
 * @param {Array} films - Tableau des films à afficher
 * @return {void} - Modifie le DOM pour afficher les films
 */
function afficherFilms(films) {
    conteneurFilms.innerHTML = '';
    films.forEach(film => {
        const divFilm = document.createElement('article');
        divFilm.className = 'film-card';
        divFilm.setAttribute('role', 'article');
        divFilm.setAttribute('aria-label', `Film: ${film.titre}`);
        divFilm.innerHTML = obtenirHtmlFilm(film);

        ajouterEvenementsPopupVideo(divFilm, film);
        ajouterSeancesAuFilm(divFilm, film);
        conteneurFilms.appendChild(divFilm);
    });
}

/**
 * Génère le HTML d'un film
 * @param {Object} film - Données du film
 * @return {string} - HTML formaté du film
 */
function obtenirHtmlFilm(film) {
    return `
        <div class="film-header">
            <img src="../assets/images/films/${film.image}" alt="Affiche du film: ${film.titre}" class="film-img" tabindex="0" role="button" aria-label="Voir la bande-annonce de ${film.titre}">
            <div class="film-texte">
            <div class="film-mention">
                ${film.mention_frisson ? '<span class="frisson">Frisson</span>' : ''}
                ${film.nouveau ? '<span class="nouveau">Nouveau</span>' : ''}
            </div>
            <h2>${film.titre}</h2>
            <div class="film-information">
                <div class="film-genres">${film.genre.join(' - ')}</div>
                <div class="film-duree">(${Math.floor(film.durée_minutes / 60)}h${film.durée_minutes % 60})</div>
                <div class="badge">
                <span class="badge-icon">${film.âge_minimum}</span>
                ${film.avertissement_violence ? '<span class="badge-icon">!</span>' : ''}
                </div>
            </div>
            </div>
        </div>
        <div class="seances-list"></div>
        <modal class="popup-video" style="display:none;" aria-hidden="true" role="dialog" aria-modal="true">
            <div class="popup">
                <button class="close-popup" aria-label="Fermer la vidéo">×</button>
                <iframe width="800" height="450" src="" title="Bande-annonce de ${film.titre}" frameborder="0" allowfullscreen loading="lazy"></iframe>
            </div>
        </modal>
    `;
}

/**
 * Ajoute les événements de la popup vidéo à un film
 * @param {HTMLElement} divFilm - Élément DOM du film
 * @param {Object} film - Données du film
 * @return {void} - Attache les gestionnaires d'événements pour la popup
 */
function ajouterEvenementsPopupVideo(divFilm, film) {
    const imageFilm = divFilm.querySelector('.film-img');
    const popup = divFilm.querySelector('.popup-video');
    const boutonFermer = divFilm.querySelector('.close-popup');
    const iframe = divFilm.querySelector('iframe');
    
    if (imageFilm && popup && boutonFermer && iframe) {
        /**
         * Ouvre la modal vidéo
         * @param {void} - Aucun paramètre
         * @return {void} - Affiche la popup et charge la vidéo
         */
        const ouvrirModal = () => {
            iframe.src = `https://www.youtube-nocookie.com/embed/${film.youtube_id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
            popup.style.display = 'flex';
            popup.classList.add('active');
            popup.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus sur le bouton fermer après un délai pour l'animation
            setTimeout(() => {
                boutonFermer.focus();
            }, 100);
        };

        // Clic sur l'image
        imageFilm.addEventListener('click', ouvrirModal);
        
        // Support clavier pour l'image
        imageFilm.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                ouvrirModal();
            }
        });
        
        /**
         * Ferme la modal vidéo
         * @param {void} - Aucun paramètre
         * @return {void} - Cache la popup et arrête la vidéo
         */
        const fermerModal = () => {
            popup.classList.remove('active');
            popup.setAttribute('aria-hidden', 'true');
            iframe.src = '';
            document.body.style.overflow = 'auto';
            
            // Cacher après l'animation
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
            
            imageFilm.focus();
        };
        
        boutonFermer.addEventListener('click', fermerModal);
        
        boutonFermer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fermerModal();
            }
        });
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                fermerModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                fermerModal();
            }
        });
    }
}

/**
 * Ajoute les séances filtrées à un film
 * @param {HTMLElement} divFilm - Élément DOM du film
 * @param {Object} film - Données du film
 * @return {void} - Ajoute les séances dans le DOM
 */
function ajouterSeancesAuFilm(divFilm, film) {
    const listeSeances = divFilm.querySelector('.seances-list');
    film.séances.forEach(seance => {
        // Filtrage local pour chaque séance
        const salle = selecteurSalle.value;
        const langue = selecteurLangue.value;
        const correspondanceSalle = !salle || seance[salle] === true;
        let correspondanceLangue = true;
        if (langue === 'vf') correspondanceLangue = seance.vf === true;
        if (langue === 'vost') correspondanceLangue = seance.vost === true;
        if (!(correspondanceSalle && correspondanceLangue)) return;
        
        listeSeances.innerHTML += obtenirHtmlSeance(film, seance);
    });
}

/**
 * Génère le HTML d'une séance
 * @param {Object} film - Données du film
 * @param {Object} seance - Données de la séance
 * @return {string} - HTML formaté de la séance
 */
function obtenirHtmlSeance(film, seance) {
    return `
        <a href="vos-places.html?film=${encodeURIComponent(film.titre)}&horaire=${encodeURIComponent(seance.horaire)}" class="seance-link" aria-label="Réserver une place pour la séance à ${seance.horaire}">
            <article class="seance-card" role="article" aria-label="Séance ${seance.horaire}">
            
                <div class="salle-details">
                    ${seance.imax ? '<span class="salle-type">IMAX</span>' : ''}
                    ${seance['4k'] ? '<span class="salle-type">4K</span>' : ''}
                    ${seance['4D'] ? '<span class="salle-type">4D</span>' : ''}
                </div>
                <div class="seance-details">
                    <div class="seance-info">
                        <span class="horaire">${seance.horaire}</span>
                        ${seance.vf ? '<span class="langue">VF</span>' : ''}
                        ${seance.vost ? '<span class="langue">VOSTFR</span>' : ''}
                    </div>
                    ${seance.handicap ? "<img src='../assets/images/pictos/desactive.png' class='handicap' alt='Accès handicapé disponible'>" : ''}
                </div>
            </article>
        </a>
    `;
}

/**
 * Initialise les filtres avec les données des films
 * @param {void} - Aucun paramètre
 * @return {void} - Remplit les options de filtrage
 */
function initialiserFiltres() {
    // Récupérer tous les genres uniques
    const genres = [...new Set(donneesFilms.flatMap(film => film.genre))];

    // Remplir le select des genres
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        selecteurGenre.appendChild(option);
    });
}

/**
 * Configure le bouton de retour en haut de page
 * @param {void} - Aucun paramètre
 * @return {void} - Ajoute l'événement au bouton scroller
 */
function configurerBoutonRetourHaut() {
    const scroller = document.getElementById('scroller');
    scroller.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Ajout des écouteurs d'événements
selecteurGenre.addEventListener('change', filtrerFilms);
selecteurSalle.addEventListener('change', filtrerFilms);
selecteurLangue.addEventListener('change', filtrerFilms);
champRecherche.addEventListener('input', filtrerFilms);

// Chargement des données et initialisation
fetch('/assets/json/films.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        donneesFilms = data;
        initialiserFiltres();
        filtrerFilms();
    })
    .catch(erreur => {
        // Gestion silencieuse des erreurs
    });

configurerBoutonRetourHaut();
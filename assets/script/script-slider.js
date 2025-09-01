/**
 * Gestionnaire du slider d'images en arrière-plan
 * @param {void} - Aucun paramètre
 * @return {void} - Initialise et démarre le slider
 */
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector('.slider');
    const images = slider.querySelectorAll('.slider-image');
    let indexActuel = 0;
    let intervalId;

    /**
     * Affiche une slide spécifique
     * @param {number} i - Index de l'image à afficher
     * @return {void} - Modifie les classes CSS pour afficher l'image
     */
    function afficherSlide(i) {
        images.forEach((img, idx) => {
            img.classList.toggle('active', idx === i);
        });
    }

    /**
     * Passe à la slide suivante
     * @param {void} - Aucun paramètre
     * @return {void} - Incrémente l'index et affiche la slide suivante
     */
    function slideSuivante() {
        indexActuel = (indexActuel + 1) % images.length;
        afficherSlide(indexActuel);
    }

    /**
     * Démarre le slider automatique
     * @param {void} - Aucun paramètre
     * @return {void} - Lance l'affichage initial et l'intervalle
     */
    function demarrerSlider() {
        afficherSlide(indexActuel);
        intervalId = setInterval(slideSuivante, 3000);
    }

    /**
     * Gère le redimensionnement de la fenêtre
     * @param {void} - Aucun paramètre
     * @return {void} - Réajuste l'affichage lors du resize
     */
    window.addEventListener('resize', () => {
        afficherSlide(indexActuel);
    });

    demarrerSlider();
});


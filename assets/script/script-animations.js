document.addEventListener('DOMContentLoaded', () => {
    let isTransitioning = false;

    // ======== PAGE TRANSITIONS ========
    
    // Créer l'overlay de transition
    function createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #090A0B 0%, #1a1a1a 50%, #090A0B 100%);
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Ajouter un loader avec le logo Pathé
        overlay.innerHTML = `
            <div style="text-align: center; animation: pulse 1.5s infinite;">
                <img src="../assets/images/pictos/logo-international-white.png" 
                     alt="Logo Pathé" 
                     style="width: 80px; height: auto; margin-bottom: 15px;">
                <div style="color: #FEB91E; font-family: 'heebo-medium'; font-size: 1.2rem;">
                    Chargement...
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }

    // Ajouter les animations CSS
    function addTransitionStyles() {
        if (!document.getElementById('transition-styles')) {
            const style = document.createElement('style');
            style.id = 'transition-styles';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeOut {
                    0% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
                
                .page-transition-in {
                    animation: fadeIn 0.6s ease forwards;
                }
                
                .page-transition-out {
                    animation: fadeOut 0.4s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Effectuer la transition
    function performTransition(url) {
        if (isTransitioning) return;
        isTransitioning = true;

        const overlay = createTransitionOverlay();
        const mainContent = document.querySelector('main') || document.body;

        // Animation de sortie
        mainContent.classList.add('page-transition-out');
        
        // Afficher l'overlay
        setTimeout(() => {
            overlay.style.pointerEvents = 'all';
            overlay.style.opacity = '1';
        }, 100);

        // Redirection après l'animation
        setTimeout(() => {
            window.location.href = url;
        }, 600);
    }

    // Animation d'entrée sur la nouvelle page
    function animatePageEntry() {
        const mainContent = document.querySelector('main') || document.body;
        mainContent.classList.add('page-transition-in');
        
        // Nettoyer après l'animation
        setTimeout(() => {
            mainContent.classList.remove('page-transition-in');
        }, 600);
    }

    // Intercepter les clics sur les liens internes
    function attachTransitionListeners() {
        const links = document.querySelectorAll('a[href]:not([href^="http"]):not([href^="#"]):not([target="_blank"])');
        
        links.forEach(link => {
            // Ne pas intercepter si déjà traité
            if (link.hasAttribute('data-transition-attached')) return;
            link.setAttribute('data-transition-attached', 'true');

            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Ignorer les liens vides ou les ancres
                if (!href || href === '#' || href.startsWith('#')) return;
                
                e.preventDefault();
                performTransition(href);
            });
        });
    }

    // Observer les changements DOM pour les nouveaux liens
    function observeNewLinks() {
        const observer = new MutationObserver((mutations) => {
            let hasNewLinks = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches('a[href]') || node.querySelector('a[href]')) {
                                hasNewLinks = true;
                            }
                        }
                    });
                }
            });
            
            if (hasNewLinks) {
                attachTransitionListeners();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ======== CURSOR LIGHT EFFECT ========
    
    let cursorLight;

    function createCursorLight() {
        cursorLight = document.createElement('div');
        cursorLight.id = 'cursor-light';
        cursorLight.style.cssText = `
            position: fixed;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        `;
        document.body.appendChild(cursorLight);
    }

    function updateCursorPosition(e) {
        if (cursorLight) {
            cursorLight.style.left = e.clientX + 'px';
            cursorLight.style.top = e.clientY + 'px';
        }
    }

    function handleMouseEnter() {
        if (cursorLight) {
            cursorLight.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorLight.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.01) 40%, transparent 70%)';
        }
    }

    function handleMouseLeave() {
        if (cursorLight) {
            cursorLight.style.background = 'none';
        }
    }

    function initCursorLight() {
        // Vérifier si on est sur un appareil tactile
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return; // Ne pas activer l'effet sur les appareils tactiles
        }

        createCursorLight();

        // Suivre le mouvement de la souris
        document.addEventListener('mousemove', updateCursorPosition);

        // Effets sur les éléments interactifs
        const interactiveElements = 'a, button, .btn-primary, .btn-secondary, .btn-icon, input, select, .film-img, .seat';
        
        // Utiliser la délégation d'événements pour les éléments dynamiques avec vérification
        document.addEventListener('mouseenter', (e) => {
            if (e.target && typeof e.target.matches === 'function' && e.target.matches(interactiveElements)) {
                handleMouseEnter();
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target && typeof e.target.matches === 'function' && e.target.matches(interactiveElements)) {
                handleMouseLeave();
            }
        }, true);

        // Cacher le curseur quand il quitte la fenêtre
        document.addEventListener('mouseleave', () => {
            if (cursorLight) {
                cursorLight.style.opacity = '0';
            }
        });

        document.addEventListener('mouseenter', () => {
            if (cursorLight) {
                cursorLight.style.opacity = '1';
            }
        });
    }

    // ======== INITIALISATION ========
    
    // Initialiser les transitions
    addTransitionStyles();
    attachTransitionListeners();
    observeNewLinks();
    animatePageEntry();

    // Initialiser l'effet de curseur
    initCursorLight();

    // Initialiser les animations de panier
    addCartAnimationStyles();

    // Réattacher après chargement du contenu dynamique
    setTimeout(() => {
        attachTransitionListeners();
    }, 1000);
});

 // Fonction pour créer l'animation d'ajout au panier
function createCartAnimation(snackElement, snackData) {
    // Créer un élément volant qui imite le snack
    const flyingSnack = document.createElement('div');
    flyingSnack.style.cssText = `
        position: fixed;
        width: 60px;
        height: 60px;
        background-image: url('../assets/images/snacks/${snackData.image}');
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(254, 185, 30, 0.6);
        border: 2px solid #FEB91E;
    `;

    // Position initiale (sur le snack cliqué)
    const rect = snackElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Position finale (vers le panier/total)
    const totalSection = document.querySelector('.total-section');
    const targetRect = totalSection ? totalSection.getBoundingClientRect() : 
                    { left: window.innerWidth - 100, top: window.innerHeight - 100 };
    const endX = targetRect.left + 50;
    const endY = targetRect.top + 50;

    flyingSnack.style.left = startX + 'px';
    flyingSnack.style.top = startY + 'px';
    flyingSnack.style.transform = 'translate(-50%, -50%) scale(1)';

    document.body.appendChild(flyingSnack);

    // Animation de vol vers le panier
    flyingSnack.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
        flyingSnack.style.left = endX + 'px';
        flyingSnack.style.top = endY + 'px';
        flyingSnack.style.transform = 'translate(-50%, -50%) scale(0.3)';
        flyingSnack.style.opacity = '0.7';
    }, 50);

    // Effet de rebond sur le panier supprimé - juste créer les particules
    setTimeout(() => {
        // Créer un effet de particles
        createParticleEffect(endX, endY);
        
        // Supprimer l'élément volant
        flyingSnack.remove();
    }, 850);
}

// Fonction pour créer un effet de particules
function createParticleEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background-color: #FEB91E;
            border-radius: 50%;
            z-index: 9998;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
        `;

        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;

        document.body.appendChild(particle);

        particle.style.transition = 'all 0.6s ease-out';
        setTimeout(() => {
            particle.style.left = endX + 'px';
            particle.style.top = endY + 'px';
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0)';
        }, 50);

        setTimeout(() => particle.remove(), 650);
    }
}

// Ajouter les styles CSS pour les animations
function addCartAnimationStyles() {
    if (!document.getElementById('cart-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-animation-styles';
        style.textContent = `
            @keyframes counter-pop {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); color: #FEB91E; }
                100% { transform: scale(1); }
            }
            
            .snack-count-animated {
                animation: counter-pop 0.4s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Fonction pour créer l'animation de suppression du panier
function createRemoveAnimation(snackElement, snackData) {
    // Créer un élément volant qui imite le snack
    const flyingSnack = document.createElement('div');
    flyingSnack.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        background-image: url('../assets/images/snacks/${snackData.image}');
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(255, 0, 0, 0.6);
        border: 2px solid #ff0000;
        opacity: 0.8;
    `;

    // Position initiale (vers le panier/total)
    const totalSection = document.querySelector('.total-section');
    const targetRect = totalSection ? totalSection.getBoundingClientRect() : 
                    { left: window.innerWidth - 100, top: window.innerHeight - 100 };
    const startX = targetRect.left + 50;
    const startY = targetRect.top + 50;

    // Position finale (vers le snack original ou hors écran)
    let endX, endY;
    if (snackElement) {
        const rect = snackElement.getBoundingClientRect();
        endX = rect.left + rect.width / 2;
        endY = rect.top + rect.height / 2;
    } else {
        // Si pas d'élément snack visible, sortir vers la droite
        endX = window.innerWidth + 100;
        endY = startY;
    }

    flyingSnack.style.left = startX + 'px';
    flyingSnack.style.top = startY + 'px';
    flyingSnack.style.transform = 'translate(-50%, -50%) scale(1)';

    document.body.appendChild(flyingSnack);

    // Animation de retour
    flyingSnack.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
        flyingSnack.style.left = endX + 'px';
        flyingSnack.style.top = endY + 'px';
        flyingSnack.style.transform = 'translate(-50%, -50%) scale(0.2)';
        flyingSnack.style.opacity = '0';
    }, 50);

    // Supprimer l'élément volant
    setTimeout(() => {
        flyingSnack.remove();
    }, 650);
}
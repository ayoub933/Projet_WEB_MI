/* ======================================= */
/* CODE FINAL RECOMMANDÉ pour scripts.js  */
/* ======================================= */

gsap.registerPlugin(ScrollTrigger);

// === Utilise 'load' pour éviter le "TP" (saut) au chargement ===
window.addEventListener('load', () => {
    console.log("Window loaded, scripts starting...");

    // --- Code Animation GSAP (S'assurer qu'il est correct) ---
    const heroSection = document.querySelector('.hero-scroll-section');
    const heroContent = document.querySelector('.hero-content');
    const productsSection = document.querySelector('#products.products-section');
    const productsTitle = productsSection ? productsSection.querySelector('.products-title') : null;
    const productsGrid = productsSection ? productsSection.querySelector('.products-grid') : null; // Cible la grille

    if (heroSection && heroContent && productsSection && productsTitle && productsGrid) {
        gsap.set(heroContent, { autoAlpha: 1, yPercent: 0 });
        gsap.set(productsSection, { autoAlpha: 1 });
        gsap.set(productsTitle, { autoAlpha: 0, y: -50 }); // Caché en haut
        gsap.set(productsGrid, { autoAlpha: 0, y: -50 });  // Caché en haut

        const heroTl = gsap.timeline({
            scrollTrigger: { trigger: heroSection, start: "top top", end: "+=100%", scrub: 1.5, pin: true, pinSpacing: true, invalidateOnRefresh: true }
        });
        heroTl.to(heroContent, { autoAlpha: 0, yPercent: -50, ease: "power1.inOut" }, 0)
              .to(productsTitle, { autoAlpha: 1, y: 0, ease: "power1.in" }, 0.15) // Haut -> Bas EaseIn
              .to(productsGrid, { autoAlpha: 1, y: 0, ease: "power1.in" }, "<+=0.15"); // Haut -> Bas EaseIn
        console.log("GSAP animations setup.");
    } else { console.warn("GSAP: Elements manquants pour anim scroll."); }
    // --- Fin Code Animation GSAP ---


    // --- Code AJAX pour ajout panier (VÉRIFIE ATTENTIVEMENT) ---
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    const toastNotification = document.getElementById('toast-notification');

    if (addToCartForms.length > 0 && toastNotification) {
        addToCartForms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                // >>>>> 1. CETTE LIGNE EST CRUCIALE !!! <<<<<
                event.preventDefault();
                // >>>>> FIN (1) <<<<<

                const actionUrl = form.action; // Récupère l'URL du formulaire (ex: /add-to-cart/ID)
                console.log(`AJAX: Interception soumission vers ${actionUrl}`);

                try {
                    // >>>>> 2. CETTE PARTIE headers EST CRUCIALE !!! <<<<<
                    const response = await fetch(actionUrl, {
                        method: 'POST', // Méthode POST du formulaire
                        headers: {
                            // Dit au serveur qu'on attend du JSON en retour
                            'Accept': 'application/json'
                        }
                        // Pas de 'body' ici car les données sont dans l'URL (l'ID)
                    });
                    // >>>>> FIN (2) <<<<<

                    // Gère la réponse serveur
                    if (!response.ok) { // Si le statut n'est pas 2xx (ex: 404, 500)
                        let errorMsg = `Erreur serveur: ${response.status}`;
                        try { // Essaye de lire un message d'erreur JSON si le serveur en envoie un
                             const errorResult = await response.json();
                             errorMsg = errorResult.message || errorMsg;
                        } catch (e) { console.log("Réponse d'erreur serveur non JSON."); }
                        throw new Error(errorMsg); // Lance l'erreur pour aller au bloc catch
                    }

                    // Si la réponse est OK (2xx), on s'attend à du JSON
                    const result = await response.json(); // Tente de parser la réponse JSON
                    console.log("AJAX: Réponse JSON reçue:", result);

                    if (result.success) { // Si le JSON contient success: true
                        toastNotification.textContent = result.message || 'Ajouté !';
                        toastNotification.className = 'toast show success'; // Style succès
                         setTimeout(() => { toastNotification.classList.remove('show'); }, 3000);
                        console.log("AJAX: Succès:", result.message);
                         // Ici tu pourrais ajouter du code pour mettre à jour un compteur panier dans le header, etc.
                    } else { // Si le JSON contient success: false
                        throw new Error(result.message || 'Le serveur signale une erreur');
                    }

                } catch (error) { // Gère les erreurs (réseau, parse JSON, ou throw new Error)
                    console.error('AJAX Erreur ajout panier:', error);
                    toastNotification.textContent = error.message || 'Erreur ajout';
                    toastNotification.className = 'toast show error'; // Style erreur
                     setTimeout(() => {
                         toastNotification.classList.remove('show');
                         toastNotification.className = 'toast'; // Nettoie
                     }, 3500);
                }
            });
        });
        console.log("AJAX: Listeners ajout panier prêts.");
    } else {
        if (addToCartForms.length === 0) console.warn("AJAX Warning: Aucun formulaire '.add-to-cart-form' trouvé.");
        if (!toastNotification) console.warn("AJAX Warning: Aucun élément '#toast-notification' trouvé.");
    }
    // --- Fin Code AJAX ---

});
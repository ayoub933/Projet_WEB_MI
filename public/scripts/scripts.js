gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    console.log("Window loaded, scripts starting...");

    const heroSection = document.querySelector('.hero-scroll-section');
    const heroContent = document.querySelector('.hero-content');
    const productsSection = document.querySelector('#products.products-section');
    const productsTitle = productsSection ? productsSection.querySelector('.products-title') : null;
    const productsGrid = productsSection ? productsSection.querySelector('.products-grid') : null;

    if (heroSection && heroContent && productsSection && productsTitle && productsGrid) {
        gsap.set(heroContent, { autoAlpha: 1, yPercent: 0 });
        gsap.set(productsSection, { autoAlpha: 1 });
        gsap.set(productsTitle, { autoAlpha: 0, y: -50 });
        gsap.set(productsGrid, { autoAlpha: 0, y: -50 });  

        const heroTl = gsap.timeline({
            scrollTrigger: { trigger: heroSection, start: "top top", end: "+=100%", scrub: 1.5, pin: true, pinSpacing: true, invalidateOnRefresh: true }
        });
        heroTl.to(heroContent, { autoAlpha: 0, yPercent: -50, ease: "power1.inOut" }, 0)
              .to(productsTitle, { autoAlpha: 1, y: 0, ease: "power1.in" }, 0.15) 
              .to(productsGrid, { autoAlpha: 1, y: 0, ease: "power1.in" }, "<+=0.15"); 
        console.log("GSAP animations setup.");
    } else { console.warn("GSAP: Elements manquants pour anim scroll."); }
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    const toastNotification = document.getElementById('toast-notification');

    if (addToCartForms.length > 0 && toastNotification) {
        addToCartForms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const actionUrl = form.action; // Récupère l'URL du formulaire (ex: /add-to-cart/ID)
                console.log(`AJAX: Interception soumission vers ${actionUrl}`);

                try {
                    const response = await fetch(actionUrl, {
                        method: 'POST', // Méthode POST du formulaire
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    if (!response.ok) { // Si le statut n'est pas 2xx (ex: 404, 500)
                        let errorMsg = `Erreur serveur: ${response.status}`;
                        try { // Essaye de lire un message d'erreur JSON si le serveur en envoie un
                             const errorResult = await response.json();
                             errorMsg = errorResult.message || errorMsg;
                        } catch (e) { console.log("Réponse d'erreur serveur non JSON."); }
                        throw new Error(errorMsg);
                    }

                    const result = await response.json(); 
                    console.log("AJAX: Réponse JSON reçue:", result);

                    if (result.success) { 
                        toastNotification.textContent = result.message || 'Ajouté !';
                        toastNotification.className = 'toast show success';
                         setTimeout(() => { toastNotification.classList.remove('show'); }, 3000);
                        console.log("Succès:", result.message);
                    } else { 
                        throw new Error(result.message || 'Le serveur signale une erreur');
                    }

                } catch (error) { // Gère les erreurs (réseau, parse JSON, ou throw new Error)
                    console.error('Erreur ajout panier:', error);
                    toastNotification.textContent = error.message || 'Erreur ajout';
                    toastNotification.className = 'toast show error'; // Style erreur
                     setTimeout(() => {
                         toastNotification.classList.remove('show');
                         toastNotification.className = 'toast'; // Nettoie
                     }, 3500);
                }
            });
        });
        console.log("Listeners ajout panier prêts.");
    } else {
        if (addToCartForms.length === 0) console.warn("Warning: Aucun formulaire '.add-to-cart-form' trouvé.");
        if (!toastNotification) console.warn("Warning: Aucun élément '#toast-notification' trouvé.");
    }

});
/* ======================================= */
/* CODE FINAL RECOMMANDÉ pour scripts.js  */
/* ======================================= */

gsap.registerPlugin(ScrollTrigger);

// === Utilise 'load' pour éviter le "TP" (saut) au chargement ===
window.addEventListener('load', () => {
    console.log("Window loaded, starting scripts (V6 + EJS/CSS Fix Final)...");

    // --- Code AJAX (inchangé) ---
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    const toastNotification = document.getElementById('toast-notification');
    if (addToCartForms.length > 0 && toastNotification) {
      addToCartForms.forEach(form => {
        form.addEventListener('submit', async (event) => {
           event.preventDefault();
           const actionUrl = form.action;
           try {
               const response = await fetch(actionUrl, { method: 'POST', headers: { 'Accept': 'application/json' } });
               if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
               const result = await response.json();
               if (result.success) {
                   toastNotification.textContent = result.message || 'Article ajouté !';
                   toastNotification.style.backgroundColor = '';
                   toastNotification.classList.add('show');
                   setTimeout(() => { toastNotification.classList.remove('show'); }, 3000);
               } else { throw new Error(result.message || 'Erreur inconnue'); }
           } catch (error) {
               console.error('Erreur lors de l\'ajout au panier:', error);
               toastNotification.textContent = error.message || 'Erreur ajout panier';
               toastNotification.style.backgroundColor = 'var(--color-error)';
               toastNotification.classList.add('show');
               setTimeout(() => {
                   toastNotification.classList.remove('show');
                   toastNotification.style.backgroundColor = '';
                }, 3500);
           }
        });
      });
      console.log("AJAX Add-to-Cart listeners added.");
    } else { /* ... logs si éléments manquants ... */ }
    // --- Fin Code AJAX ---


    // --- Animation Scroll ---
    console.log("Setting up GSAP Scroll...");

    const heroSection = document.querySelector('.hero-scroll-section');
    const heroContent = document.querySelector('.hero-content');
    // Ciblage de la section produits UNIQUE et CORRECTE (après fix EJS)
    const productsSection = document.querySelector('#products.products-section');

    // Vérification finale des éléments après corrections HTML/CSS
    if (!heroSection) console.error("GSAP ERREUR: '.hero-scroll-section' non trouvé!");
    if (!heroContent) console.error("GSAP ERREUR: '.hero-content' non trouvé!");
    if (!productsSection) {
        console.error("GSAP ERREUR: '#products.products-section' non trouvé! Vérifie que tu as bien corrigé index.ejs.");
    }

    // On continue seulement si les 3 éléments sont trouvés
    if (heroSection && heroContent && productsSection) {
        console.log("Elements found. Setting initial states with autoAlpha...");

        // États Initiaux gérés PROPREMENT par GSAP
        gsap.set(heroContent, { autoAlpha: 1, yPercent: 0 }); // Hero visible
        gsap.set(productsSection, { autoAlpha: 0 }); // Produits cachés

        // Timeline principale
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "+=100%",       // Fin stable
                scrub: 1.5,          // Garde le scrub du V6
                pin: true,
                pinSpacing: true,
                // markers: true,    // Décommente pour voir la zone de scroll
                invalidateOnRefresh: true,
                // anticipatePin: 1 // Optionnel si 'load' ne suffit pas pour le TP
            }
        });

        console.log("Timeline created. Adding animations...");

        // 1. Animation Hero (Disparaît)
        heroTl.to(heroContent, {
            autoAlpha: 0,        // Utilise autoAlpha (plus fiable)
            yPercent: -50,
            ease: "power1.inOut" // Garde l'ease du V6
        }, 0); // Commence au début

        // 2. Animation Produits (Apparaît)
        heroTl.to(productsSection, {
            autoAlpha: 1,        // Utilise autoAlpha
            ease: "power1.inOut" // Même ease
        // Ajuste le timing ici pour la synchro parfaite :
        // }, 0); // Commence pile en même temps que le texte disparaît
        // }, 0.1); // Commence 0.1s après
         }, 0.2); // Commence 0.2s après (valeur de départ raisonnable)
        // }, ">-0.5"); // Commence 0.5s avant la fin de l'anim du texte (chevauchement)

        console.log("GSAP setup complete.");

    } else {
        console.error("Setup GSAP annulé: éléments manquants. VÉRIFIE TON FICHIER EJS et les sélecteurs JS !");
    }
    // --- Fin Animation Scroll ---

}); // Fin du window.onload
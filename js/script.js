// =========================================
// SCRIPT DE ANIMACIONES INTERACTIVAS Y UI
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------------
       0. CURSOR PERSONALIZADO
       ----------------------------------------------------- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // El punto sigue al mouse inmediatamente
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // El contorno tiene un pequeño retraso animado nativo, o podemos usar la API de animaciones
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Agregar efecto de hover a todos los enlaces y botones
    const hoverElements = document.querySelectorAll('a, button, .project-image, .glass-card, .hamburger');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    /* -----------------------------------------------------
       1. EFECTO DE NAVEGADOR AL HACER SCROLL (GLASSMORPHISM)
       ----------------------------------------------------- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* -----------------------------------------------------
       2. SCROLL SUAVE PARA LOS ENLACES DEL MENÚ
       ----------------------------------------------------- */
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Evitar comportamiento por defecto
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSeccion = document.querySelector(targetId);

            if (targetSeccion) {
                // Cálculo de la posición (restando la altura aproximada del navbar)
                const headerOffset = 80;
                const elementPosition = targetSeccion.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* -----------------------------------------------------
       3. EFECTO REVEAL AL HACER SCROLL (Intersection Observer)
       ----------------------------------------------------- */
    // Configuramos CSS extra inyectado por JS para las animaciones base
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Retrasos escalonados para elementos agrupados */
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
    `;
    document.head.appendChild(styleSheet);

    // Añadir clase 'reveal' a elementos clave
    const elementosAnimar = document.querySelectorAll('.section-title, .section-content, .stat-item, .skill-category, .project-item, .contact-info, .contact-form, .service-card, .hero-image');

    elementosAnimar.forEach((el, index) => {
        el.classList.add('reveal');

        // Agregar delays a cards en la misma fila (stats o skills)
        if (el.classList.contains('stat-item') || el.classList.contains('skill-category')) {
            // Un truco simple para dar delays de 1,2,3... según índice.
            el.style.transitionDelay = `${(index % 3) * 0.15}s`;
        }
    });

    // Observer para revelar elementos
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: dejar de observar si solo quieres que se anime una vez
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Porcentaje del elemento visible antes de animar
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    elementosAnimar.forEach(el => {
        revealObserver.observe(el);
    });

    /* -----------------------------------------------------
       4. MENÚ HAMBURGUESA (Móviles)
       ----------------------------------------------------- */
    // Lógica simple para mostrar/ocultar menú en móvil
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const btnOutline = document.querySelector('.navbar .btn-outline');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Aquí se podría implementar una pequeña clase en CSS para un menú lateral (drawer)
            // Por simplicidad, alertamos que está en progreso para la demo,
            // o podrías agregar un pequeño toggle.

            const isVisible = navLinksContainer.style.display === 'flex';
            if (isVisible) {
                navLinksContainer.style.display = 'none';
                if (btnOutline) btnOutline.style.display = 'none';
            } else {
                navLinksContainer.style.display = 'flex';
                navLinksContainer.style.flexDirection = 'column';
                navLinksContainer.style.position = 'absolute';
                navLinksContainer.style.top = '100%';
                navLinksContainer.style.left = '0';
                navLinksContainer.style.width = '100%';
                navLinksContainer.style.background = 'rgba(10, 10, 10, 0.95)';
                navLinksContainer.style.padding = '2rem 5%';

                if (btnOutline) btnOutline.style.display = 'inline-flex';
            }
        });
    }

});

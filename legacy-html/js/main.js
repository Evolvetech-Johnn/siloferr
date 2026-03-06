document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Header & Navigation
       ========================================================================== */
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Mobile Nav Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Close mobile menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       Hero Carousel
       ========================================================================== */
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    let currentSlide = 0;
    const slideCount = carouselItems.length;

    if (slideCount > 0) {
        // Create indicators
        for (let i = 0; i < slideCount; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
        const indicators = document.querySelectorAll('.indicator');

        function updateCarousel() {
            // Remove active class from all
            carouselItems.forEach(item => item.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));
            
            // Add active class to current
            carouselItems[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Retrigger animations
            const elements = carouselItems[currentSlide].querySelectorAll('.animate-up');
            elements.forEach(el => {
                el.style.animation = 'none';
                void el.offsetWidth; // trigger reflow
                el.style.animation = null;
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateCarousel();
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto advance
        setInterval(nextSlide, 5000);
    }

    /* ==========================================================================
       Products Portfolio Logic
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    // Product Data
    const products = [
        { id: 1, category: 'equipamentos', title: 'Redutor de Velocidade', img: 'https://siloferr.com.br/Content/img/portfolio/produto2.jpg' },
        { id: 2, category: 'silos', title: 'Silos Planos', img: 'https://siloferr.com.br/Content/img/portfolio/silo1.jpg' },
        { id: 3, category: 'acessorios', title: 'Correias Transportadoras', img: 'https://siloferr.com.br/Content/img/portfolio/18.jpg' },
        { id: 4, category: 'equipamentos', title: 'Elevador de Canecas', img: 'https://siloferr.com.br/Content/img/portfolio/6.jpg' },
        { id: 5, category: 'equipamentos', title: 'Plataforma Móvel', img: 'https://siloferr.com.br/Content/img/portfolio/43.jpeg' },
        { id: 6, category: 'silos', title: 'Secador de Sementes', img: 'https://siloferr.com.br/Content/img/portfolio/44.jpg' },
        { id: 7, category: 'acessorios', title: 'Rolamentos', img: 'https://siloferr.com.br/Content/img/portfolio/40.jpg' },
        { id: 8, category: 'equipamentos', title: 'Canecas Elevadoras', img: 'https://siloferr.com.br/Content/img/portfolio/45.jpeg' },
        { id: 9, category: 'equipamentos', title: 'Válvula Bifurcada Pneumática', img: 'https://siloferr.com.br/Content/img/portfolio/46.jpeg' },
        { id: 10, category: 'equipamentos', title: 'Conchas Metálicas', img: 'https://siloferr.com.br/Content/img/portfolio/50.jpeg' },
        { id: 11, category: 'equipamentos', title: 'Hélices', img: 'https://siloferr.com.br/Content/img/portfolio/49.jpeg' },
        { id: 12, category: 'acessorios', title: 'Correia Elevadora Completa', img: 'https://siloferr.com.br/Content/img/portfolio/48.jpeg' }
    ];

    // Render Products
    function renderProducts(filter = 'all') {
        if (!portfolioGrid) return;
        
        portfolioGrid.innerHTML = '';
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(p => p.category === filter);
            
        filteredProducts.forEach((product, index) => {
            const delay = index * 0.1;
            const itemHTML = `
                <div class="portfolio-item animate-up" style="animation-delay: ${delay}s">
                    <div class="portfolio-wrap">
                        <img src="${product.img}" alt="${product.title}">
                        <div class="portfolio-overlay">
                            <div class="portfolio-info">
                                <h4>${product.title}</h4>
                                <span>${product.category.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            portfolioGrid.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    // Initial Render
    renderProducts();

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            
            const filterValue = e.target.getAttribute('data-filter');
            renderProducts(filterValue);
        });
    });

    /* ==========================================================================
       Contact Form Submission (Mock)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
                btn.style.backgroundColor = '#25d366'; // Success Green
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    /* ==========================================================================
       Back to top
       ========================================================================== */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

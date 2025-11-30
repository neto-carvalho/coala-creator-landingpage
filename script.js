function createCircularFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#008080';
    ctx.lineWidth = 3;
    ctx.stroke();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(32, 32, 29, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 0, 0, 64, 64);
        ctx.restore();
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = canvas.toDataURL();
        document.getElementsByTagName('head')[0].appendChild(link);
    };
    img.src = 'imagens/Design sem nome (2).png';
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCircularFavicon);
} else {
    createCircularFavicon();
}
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
let lastScroll = 0;
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 128, 128, 0.2)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 128, 128, 0.1)';
    }
    lastScroll = currentScroll;
});
const carousel = document.getElementById('portfolioCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = document.querySelectorAll('.portfolio-card');
let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let animationFrameId = null;
let velocity = 0;
let lastX = 0;
let lastTime = 0;
function smoothScroll(element, target, duration = 300) {
    const start = element.scrollLeft;
    const distance = target - start;
    const startTime = performance.now();
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); 
        element.scrollLeft = start + distance * ease;
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(animate);
}
prevBtn.addEventListener('click', () => {
    const cardWidth = carousel.querySelector('.portfolio-card').offsetWidth;
    const gap = 32; 
    const scrollAmount = cardWidth + gap;
    smoothScroll(carousel, carousel.scrollLeft - scrollAmount, 400);
});
nextBtn.addEventListener('click', () => {
    const cardWidth = carousel.querySelector('.portfolio-card').offsetWidth;
    const gap = 32;
    const scrollAmount = cardWidth + gap;
    smoothScroll(carousel, carousel.scrollLeft + scrollAmount, 400);
});
carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    carousel.style.cursor = 'grabbing';
    carousel.style.scrollBehavior = 'auto';
    startX = e.pageX;
    scrollLeft = carousel.scrollLeft;
    lastX = e.pageX;
    lastTime = performance.now();
    velocity = 0;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        carousel.style.cursor = 'grab';
        carousel.style.scrollBehavior = 'smooth';
        if (Math.abs(velocity) > 0.5) {
            smoothScroll(carousel, carousel.scrollLeft + velocity * 10, 300);
        }
    }
});
carousel.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        carousel.style.cursor = 'grab';
        carousel.style.scrollBehavior = 'smooth';
        if (Math.abs(velocity) > 0.5) {
            smoothScroll(carousel, carousel.scrollLeft + velocity * 10, 300);
        }
    }
});
carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentTime = performance.now();
    const currentX = e.pageX;
    const deltaX = currentX - startX;
    const deltaTime = currentTime - lastTime;
    if (deltaTime > 0) {
        velocity = (currentX - lastX) / deltaTime;
    }
    carousel.scrollLeft = scrollLeft - deltaX;
    lastX = currentX;
    lastTime = currentTime;
});
let touchStartX = 0;
let touchScrollLeft = 0;
let touchVelocity = 0;
let touchLastX = 0;
let touchLastTime = 0;
carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
    touchLastX = e.touches[0].pageX;
    touchLastTime = performance.now();
    touchVelocity = 0;
    carousel.style.scrollBehavior = 'auto';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}, { passive: true });
carousel.addEventListener('touchmove', (e) => {
    if (!touchStartX) return;
    const currentTime = performance.now();
    const currentX = e.touches[0].pageX;
    const deltaX = currentX - touchStartX;
    const deltaTime = currentTime - touchLastTime;
    if (deltaTime > 0) {
        touchVelocity = (currentX - touchLastX) / deltaTime;
    }
    carousel.scrollLeft = touchScrollLeft - deltaX;
    touchLastX = currentX;
    touchLastTime = currentTime;
}, { passive: true });
carousel.addEventListener('touchend', () => {
    if (touchStartX) {
        carousel.style.scrollBehavior = 'smooth';
        if (Math.abs(touchVelocity) > 0.5) {
            smoothScroll(carousel, carousel.scrollLeft + touchVelocity * 15, 300);
        }
        touchStartX = 0;
    }
}, { passive: true });
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
const animateElements = document.querySelectorAll(
    '.timeline-item, .portfolio-card, .skills-card, .about-card'
);
animateElements.forEach(el => {
    observer.observe(el);
});
const shapes = document.querySelectorAll('.shape');
shapes.forEach((shape, index) => {
    shape.style.animationDelay = `${index * 5}s`;
});
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroShapes = hero.querySelector('.hero-shapes');
        if (heroShapes) {
            heroShapes.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
});
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) rotate(2deg)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg)';
    });
});
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
let ticking = false;
function updateHeader() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    ticking = false;
}
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
    }
});
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
});
const buttons = document.querySelectorAll('.btn-primary');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #00b3b3, #008080)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #008080, #00b3b3)';
    });
});
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
const portfolioData = [
    {
        title: 'Projeto Açaí',
        date: '2024',
        tags: ['Social Media', 'Branding'],
        description: 'Desenvolvimento completo de identidade visual e conteúdo para redes sociais de uma marca de açaí. O projeto incluiu criação de capas, posts para feed, stories e materiais promocionais. Design moderno e vibrante que transmite frescor e qualidade do produto, mantendo consistência visual em todas as plataformas digitais.',
        images: [
            'imagens/capa-acai-1.jpg',
            'imagens/feedacai-2.jpg',
            'imagens/ticole-acai-3.jpg'
        ]
    },
    {
        title: 'Estética Automotiva',
        date: '2024',
        tags: ['Social Media', 'Branding'],
        description: 'Desenvolvimento completo de identidade visual e conteúdo para redes sociais de uma empresa de estética automotiva. O projeto incluiu criação de posts promocionais, apresentação de serviços (lavagem, polimento, higienização interna, pintura), mockups de smartphones e materiais visuais modernos que destacam a qualidade e profissionalismo dos serviços oferecidos.',
        images: [
            'imagens/este-automo-capa-1.jpg',
            'imagens/este-autom-2.jpg',
            'imagens/este-autom-3.jpg',
            'imagens/este-autom-4.jpg'
        ]
    },
    {
        title: 'Eventos',
        date: '2024',
        tags: ['Social Media', 'Eventos'],
        description: 'Criação de identidade visual e materiais promocionais para eventos diversos. O projeto incluiu desenvolvimento de flyers, posts para redes sociais e identidade visual de eventos. Design criativo que conecta ideias e desperta o interesse do público, mantendo consistência visual em todos os materiais promocionais.',
        images: [
            'imagens/eventos-capa-1.jpg',
            'imagens/eventos-1.jpg',
            'imagens/eventos-2.jpg',
            'imagens/eventos-3.jpg',
            'imagens/eventos-4.jpg'
        ]
    },
    {
        title: 'Hamburgueria',
        date: '2024',
        tags: ['Social Media', 'Branding'],
        description: 'Desenvolvimento completo de identidade visual e conteúdo para redes sociais de uma hamburgueria. O projeto incluiu criação de posts promocionais, apresentação de produtos, cardápio visual, materiais para delivery e estratégia de conteúdo que desperta o apetite e aumenta o engajamento nas redes sociais.',
        images: [
            'imagens/hamburgueria-capa-1.jpg',
            'imagens/hamburgueria-2.jpg',
            'imagens/hamburgueria-3.jpg',
            'imagens/hamburgueria-4.jpg'
        ]
    },
    {
        title: 'Sempre Salva',
        date: '2024',
        tags: ['Social Media', 'Branding'],
        description: 'Desenvolvimento completo de identidade visual e conteúdo para redes sociais da Sempre Salva - Loja de Bebidas. O projeto incluiu criação de posts promocionais, apresentação de produtos (gin Beefeater, bebidas diversas), ofertas especiais, materiais para delivery e estratégia de conteúdo que desperta o interesse e aumenta o engajamento nas redes sociais.',
        images: [
            'imagens/sempre-salva-7.png',
            'imagens/sempre-salva-2.png',
            'imagens/sempre-salva-3.png',
            'imagens/sempre-salva-4.png',
            'imagens/sempre-salva-5.png',
            'imagens/sempre-salva-6.png',
            'imagens/sempre-salva-geral.png',
            'imagens/sempre-salva.png'
        ]
    }
];
const portfolioModal = document.getElementById('portfolioModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalTags = document.getElementById('modalTags');
const modalDate = document.getElementById('modalDate');
const modalDescription = document.getElementById('modalDescription');
const modalGallery = document.getElementById('modalGallery');
const portfolioCards = document.querySelectorAll('.portfolio-card');
function openModal(projectIndex) {
    const project = portfolioData[projectIndex];
    if (!project) return;
    modalTitle.textContent = project.title;
    modalDate.textContent = project.date;
    modalDescription.textContent = project.description;
    modalTags.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        modalTags.appendChild(tagElement);
    });
    modalGallery.innerHTML = '';
    project.images.forEach((imageUrl, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'modal-gallery-item';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${project.title} - Imagem ${index + 1}`;
        img.loading = 'lazy';
        galleryItem.appendChild(img);
        modalGallery.appendChild(galleryItem);
    });
    portfolioModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    portfolioModal.classList.remove('active');
    document.body.style.overflow = '';
}
portfolioCards.forEach((card, index) => {
    let cardIsDragging = false;
    let cardStartX = 0;
    let cardStartY = 0;
    card.addEventListener('mousedown', (e) => {
        cardIsDragging = false;
        cardStartX = e.clientX;
        cardStartY = e.clientY;
    });
    card.addEventListener('mousemove', (e) => {
        if (cardStartX !== 0 || cardStartY !== 0) {
            const deltaX = Math.abs(e.clientX - cardStartX);
            const deltaY = Math.abs(e.clientY - cardStartY);
            if (deltaX > 5 || deltaY > 5) {
                cardIsDragging = true;
            }
        }
    });
    card.addEventListener('click', (e) => {
        if (!cardIsDragging) {
            openModal(index);
        }
        cardIsDragging = false;
        cardStartX = 0;
        cardStartY = 0;
    });
    card.addEventListener('mouseup', () => {
        if (cardIsDragging) {
            cardIsDragging = false;
        }
        cardStartX = 0;
        cardStartY = 0;
    });
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDragging = false;
    card.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDragging = false;
    });
    card.addEventListener('touchmove', (e) => {
        if (touchStartX !== 0 || touchStartY !== 0) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
            if (deltaX > 10 || deltaY > 10) {
                touchDragging = true;
            }
        }
    });
    card.addEventListener('touchend', (e) => {
        if (!touchDragging) {
            e.preventDefault();
            openModal(index);
        }
        touchStartX = 0;
        touchStartY = 0;
        touchDragging = false;
    });
});
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
        closeModal();
    }
});
const modalContent = document.querySelector('.modal-content');
if (modalContent) {
    modalContent.addEventListener('wheel', (e) => {
        const { scrollTop, scrollHeight, clientHeight } = modalContent;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.preventDefault();
        }
    });
}
console.log('🚀 Coala Creator Portfolio - Carregado com sucesso!');

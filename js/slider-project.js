// ===================================================
// SLIDER DE PROJETS - VERSION AVEC LIGHTBOX CUSTOM
// Gestion du slider principal + carrousel interne + lightbox
// ===================================================

// Variables globales pour le slider principal
let currentSlide = 0;
const slides = document.querySelectorAll('.project-slide');
const totalSlides = slides.length;

// Tableau pour garder en mémoire l'index de l'image active de chaque projet
let currentImageIndexes = [];

// ===========================================
// NAVIGATION DU SLIDER PRINCIPAL (PROJETS)
// ===========================================

// Fonction pour afficher un slide spécifique
function showSlide(n) {
    if (totalSlides === 0) return;

    // Masque le slide actuel
    slides[currentSlide].classList.remove('active');

    // Calcule le nouvel index (boucle circulaire)
    currentSlide = (n + totalSlides) % totalSlides;

    // Affiche le nouveau slide
    slides[currentSlide].classList.add('active');
    
    // Met à jour le compteur
    const currentCounter = document.querySelector('.current-slide');
    if (currentCounter) {
        currentCounter.textContent = currentSlide + 1;
    }
}

// Fonction accessible depuis le HTML pour changer de projet
window.changeSlide = function(direction) {
    showSlide(currentSlide + direction);
}

// ===========================================
// CARROUSEL INTERNE (IMAGES D'UN PROJET)
// ===========================================

// Fonction pour afficher une image spécifique dans un slide
window.showImage = function(slideIndex, imageIndex) {
    const slide = slides[slideIndex];
    
    if (!slide) return;

    const images = slide.querySelectorAll('.slide-image');
    const dots = slide.querySelectorAll('.dot');

    if (images.length === 0) return;
    if (imageIndex >= images.length) imageIndex = 0;
    if (imageIndex < 0) imageIndex = images.length - 1;

    currentImageIndexes[slideIndex] = imageIndex;

    images.forEach(img => img.classList.remove('active-image'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (images[imageIndex]) {
        images[imageIndex].classList.add('active-image');
    }
    if (dots[imageIndex]) {
        dots[imageIndex].classList.add('active');
    }
}

// ===========================================
// LIGHTBOX PERSONNALISÉE
// ===========================================

window.openLightbox = function(imageSrc) {
    const lightbox = document.getElementById('customLightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (!lightbox || !lightboxImg) {
        console.error('Lightbox non trouvée dans le DOM');
        return;
    }
    
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeLightbox = function() {
    const lightbox = document.getElementById('customLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
    document.body.style.overflow = '';
}

window.navigateLightbox = function(direction) {
    const activeSlide = document.querySelector('.project-slide.active');
    if (!activeSlide) return;
    
    const images = activeSlide.querySelectorAll('.slide-image');
    
    let currentIndex = -1;
    images.forEach((img, index) => {
        if (img.classList.contains('active-image')) {
            currentIndex = index;
        }
    });
    
    if (currentIndex === -1) return;
    
    let newIndex = (currentIndex + direction + images.length) % images.length;
    
    showImage(currentSlide, newIndex);
    
    if (images[newIndex] && images[newIndex].src) {
        document.getElementById('lightbox-img').src = images[newIndex].src;
    }
}

// ===========================================
// INITIALISATION AU CHARGEMENT
// ===========================================

$(document).ready(function() {
    for (let i = 0; i < totalSlides; i++) {
        currentImageIndexes[i] = 0;
        showImage(i, 0);
    }
    
    if (totalSlides > 0) {
        showSlide(0);
        const totalCounter = document.querySelector('.total-slides');
        if (totalCounter) {
            totalCounter.textContent = totalSlides;
        }
    }

    // Bouton zoom
    $('.btn-zoom').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const activeSlide = document.querySelector('.project-slide.active');
        
        if (activeSlide) {
            const activeImage = activeSlide.querySelector('.slide-image.active-image');
            
            if (activeImage && activeImage.src) {
                openLightbox(activeImage.src);
            }
        }
    });

    // Fermer lightbox avec Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // Fermer en cliquant sur le fond
    const lightbox = document.getElementById('customLightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    // Navigation clavier
    document.addEventListener('keydown', function(e) {
        const lightboxActive = document.getElementById('customLightbox')?.classList.contains('active');
        
        if (!lightboxActive) {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const currentImageIndex = currentImageIndexes[currentSlide] || 0;
                const images = slides[currentSlide].querySelectorAll('.slide-image');
                const newIndex = (currentImageIndex - 1 + images.length) % images.length;
                showImage(currentSlide, newIndex);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const currentImageIndex = currentImageIndexes[currentSlide] || 0;
                const images = slides[currentSlide].querySelectorAll('.slide-image');
                const newIndex = (currentImageIndex + 1) % images.length;
                showImage(currentSlide, newIndex);
            }
        }
    });
});
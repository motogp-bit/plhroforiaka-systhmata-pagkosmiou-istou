document.addEventListener("DOMContentLoaded", () => {

    // Like Button Logic
    const hearts = document.querySelectorAll(".heart");
    hearts.forEach(heart => {
        heart.addEventListener("click", () => {
            heart.classList.toggle("is-active");
        });
    });

    // Hero Typewriter Effect 
    const heroText = "Welcome to Etsy-Bitsy!";
    const heroTitle = document.getElementById("typewriter-title");
    let heroCharIndex = 0;

    function typeHeroEffect() {
        if (heroCharIndex < heroText.length) {
            heroTitle.textContent += heroText.charAt(heroCharIndex);
            heroCharIndex++;
            setTimeout(typeHeroEffect, 80);
        }
    }

    // Check if the hero title exists before starting
    if (heroTitle) typeHeroEffect();


    // Scroll Intersection Observer 
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const h2 = entry.target.querySelector('#trigger-typewriter');
                if (h2) {
                    const text = h2.innerText;
                    h2.innerText = "";
                    typeWriterSection(h2, text, 80);
                }

                // Only trigger once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const infoSection = document.querySelector('.info-section');
    if (infoSection) observer.observe(infoSection);


    // Section Typewriter Effect 
    function typeWriterSection(element, text, speed) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }


    // 3D Coverflow Slideshow
    function initSlideshow() {
        const slides = document.querySelectorAll('#popular-slideshow .slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (slides.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateSlides() {
            slides.forEach((slide, i) => {
                slide.className = 'slide';

                let diff = (i - currentIndex + totalSlides) % totalSlides;

                if (diff === 0) slide.classList.add('active');
                else if (diff === 1) slide.classList.add('next');
                else if (diff === 2) slide.classList.add('next-far');
                else if (diff === totalSlides - 2) slide.classList.add('prev-far');
                else if (diff === totalSlides - 1) slide.classList.add('prev');
            });
        }

        nextBtn.onclick = () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlides();
        };

        prevBtn.onclick = () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlides();
        };

        slides.forEach((slide, index) => {
            slide.onclick = () => {
                if (slide.classList.contains('prev') || slide.classList.contains('next')) {
                    currentIndex = index;
                    updateSlides();
                }
            };
        });

        updateSlides();
    }
});
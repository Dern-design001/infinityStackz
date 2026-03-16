// Multi-Page Navigation Logic
function navigateTo(pageId) {
    const pages = document.querySelectorAll('.page-content');
    const navLinks = document.querySelectorAll('.nav-link');
    
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const activePage = document.getElementById(`page-${pageId}`);
    if (activePage) {
        activePage.classList.add('active');
        // Smooth scroll to top when changing pages
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update URL hash without jumping
    history.pushState(null, null, `#${pageId}`);
    
    // Close mobile menu if open
    document.getElementById('mobile-menu').classList.add('hidden');
}

// Handle browser back/forward buttons
window.onpopstate = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
};

// Initial setup on load
window.onload = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
    createBlossoms();
};

// Blossom Flower Creation Logic
function createBlossoms() {
    const container = document.getElementById('blossom-container');
    if (!container) return;
    
    const flowerCount = 15; // Increased count for better effect

    for (let i = 0; i < flowerCount; i++) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("class", "flower");
        
        // Detailed blossom path (5 distinct petals)
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M50 50 Q60 20 50 10 Q40 20 50 50 M50 50 Q80 40 90 50 Q80 60 50 50 M50 50 Q60 80 50 90 Q40 80 50 50 M50 50 Q20 60 10 50 Q20 40 50 50 M50 50 Q75 15 85 25 Q75 35 50 50");
        
        svg.appendChild(path);
        
        // Randomize flower properties for a natural drift
        const size = Math.random() * 25 + 15;
        const left = Math.random() * 100; // Percent based
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        const blur = Math.random() * 2;

        svg.style.width = `${size}px`;
        svg.style.height = `${size}px`;
        svg.style.left = `${left}%`;
        svg.style.bottom = `-50px`; 
        svg.style.animationDelay = `${delay}s`;
        svg.style.animationDuration = `${duration}s`;
        if (blur > 1) svg.style.filter = `blur(${blur}px) opacity(0.5)`;

        container.appendChild(svg);
    }
}

// Mobile Menu Toggle
const menuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Star Rating Logic
const stars = document.querySelectorAll('#starRating i');
const ratingInput = document.getElementById('ratingInput');
stars.forEach(star => {
    star.addEventListener('click', function() {
        const val = this.getAttribute('data-val');
        if (ratingInput) ratingInput.value = val;
        stars.forEach(s => {
            const sVal = s.getAttribute('data-val');
            if(parseInt(sVal) <= parseInt(val)) {
                s.classList.remove('far', 'text-slate-600');
                s.classList.add('fas', 'text-yellow-500');
            } else {
                s.classList.remove('fas', 'text-yellow-500');
                s.classList.add('far', 'text-slate-600');
            }
        });
    });
});

// Feedback Form Submission
const feedbackForm = document.getElementById('feedbackForm');
const feedbackSuccess = document.getElementById('feedbackSuccess');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
        submitBtn.disabled = true;
        
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
            .then(() => {
                feedbackForm.style.display = 'none';
                if (feedbackSuccess) {
                    feedbackSuccess.classList.remove('hidden');
                    feedbackSuccess.style.animation = 'slideUpFade 0.5s ease-out forwards';
                }
            }, (error) => {
                console.error('Feedback Error:', error);
                alert("Failed to send feedback. Please try again.");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// EmailJS Configuration
// Replace these with your actual IDs from the EmailJS Dashboard
const EMAILJS_PUBLIC_KEY = "O7IKOZ6ln9irjACkG"; 
const EMAILJS_SERVICE_ID = "service_avv1idd";
const EMAILJS_TEMPLATE_ID = "template_d6pbxni";

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
const contactSubmit = document.getElementById('contactSubmit');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check if keys are configured
        if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
            showStatus("Please configure your EmailJS keys in script.js", "error");
            return;
        }

        // Processing state
        contactSubmit.innerHTML = '<span>SENDING...</span><i class="fas fa-spinner fa-spin"></i>';
        contactSubmit.disabled = true;

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
            .then(() => {
                showStatus("Message sent successfully! We'll get back to you soon.", "success");
                contactForm.reset();
            }, (error) => {
                console.error('EmailJS Error:', error);
                const errorMsg = error.text || error.message || "Failed to send message.";
                showStatus(`Error: ${errorMsg}`, "error");
            })
            .finally(() => {
                contactSubmit.innerHTML = '<span>SEND MESSAGE</span><i class="fas fa-paper-plane"></i>';
                contactSubmit.disabled = false;
            });
    });
}

function showStatus(message, type) {
    if (!contactStatus) return;
    
    contactStatus.textContent = message;
    contactStatus.classList.remove('hidden', 'bg-green-500/10', 'text-green-400', 'bg-red-500/10', 'text-red-400', 'border', 'border-green-500/30', 'border-red-500/30');
    
    if (type === 'success') {
        contactStatus.classList.add('bg-green-500/10', 'text-green-400', 'border', 'border-green-500/30');
    } else {
        contactStatus.classList.add('bg-red-500/10', 'text-red-400', 'border', 'border-red-500/30');
    }
    
    setTimeout(() => {
        contactStatus.classList.add('hidden');
    }, 5000);
}

// Intersection Observer for scrolling animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card, .blue-gradient').forEach(el => {
    observer.observe(el);
});

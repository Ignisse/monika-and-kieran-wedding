// script.js
function setLanguage(lang) {
    // 1. Set the HTML tag attribute (controls CSS)
    document.documentElement.lang = lang;
    
    // 2. Save preference so it remembers on reload
    localStorage.setItem('wedding_lang', lang);

    // 3. Update active state on all switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 4. Update dynamic JS text (like the RSVP label & Placeholders)
    updateDynamicText(lang);
}

// Helper to update text that Javascript usually overwrites or attributes
function updateDynamicText(lang) {
    const notesLabel = document.getElementById('notes-label');
    const nameInput = document.getElementById('full-name');
    const passInput = document.getElementById('pass-input');
    
    // Check if user is currently attending (default to true if not checked yet to show generic text)
    const yesRadio = document.querySelector('input[name="attendance"][value="Yes"]');
    const isAttending = yesRadio ? yesRadio.checked : false;
    
    // 1. Update Note Label
    if(notesLabel) {
        if (lang === 'sk') {
            notesLabel.innerText = isAttending ? "Požiadavky na piesne alebo iné poznámky" : "Nechajte odkaz pre pár";
        } else {
            notesLabel.innerText = isAttending ? "Dietary Restrictions, Song Requests, or Other Notes" : "Leave a note for the couple";
        }
    }

    // 2. Update Placeholders
    if(nameInput) {
        nameInput.placeholder = (lang === 'sk') ? "napr. Jana Nováková & Partner" : "e.g. Jane Doe & Plus One";
    }
    if(passInput) {
        passInput.placeholder = (lang === 'sk') ? "Vložte kód sem" : "Enter Code Here";
    }
}

// Check for saved language on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('wedding_lang') || 'en';
    setLanguage(savedLang);
});

// --- 1. RSVP LOGIC (Global Functions) ---
function toggleRSVP(isAttending) {
    // 1. Grab the elements
    const guestFields = document.getElementById('guest-fields');
    const noteFields = document.getElementById('note-fields');
    const guestInput = document.getElementById('guests');

    // 2. Always show the Notes field (once they click a button)
    if (noteFields) noteFields.classList.remove('hidden');

    if (isAttending) {
        // --- YES ---
        // Show Guest Count
        if (guestFields) guestFields.classList.remove('hidden');
        // Make it required
        if (guestInput) guestInput.setAttribute('required', 'true');
    } else {
        // --- NO ---
        // Hide Guest Count
        if (guestFields) guestFields.classList.add('hidden');
        // Make it NOT required (so they can submit)
        if (guestInput) guestInput.removeAttribute('required');
    }

    // 3. Update the label text based on current language
    updateDynamicText(document.documentElement.lang);
}

function resetForm() {
    const form = document.querySelector("form[name='rsvp']");
    const successMsg = document.getElementById("rsvp-success");
    const guestFields = document.getElementById('guest-fields');
    const noteFields = document.getElementById('note-fields');
    
    // Reset Form UI
    if (successMsg) {
        successMsg.classList.add('hidden'); 
        successMsg.style.display = "none";
    } 
    if (form) {
        form.reset();
        form.classList.remove('hidden');
        form.style.display = ""; // Clear inline style if any
    }
    
    // Reset to "Hidden" state using classes
    if (guestFields) guestFields.classList.add('hidden');
    if (noteFields) guestFields.classList.add('hidden');
    
    // Reset label text by calling the updater
    updateDynamicText(document.documentElement.lang);
}

// --- 2. DOM LOADED EVENTS ---
// Wait for the page to be ready before adding listeners
document.addEventListener('DOMContentLoaded', () => {

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById("backToTop");
    
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

   // --- AJAX Form Submission ---
   const form = document.querySelector("form[name='rsvp']");
   if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
        .then((response) => {
            if (response.ok) {
                const successMsg = document.getElementById("rsvp-success"); 

                // Hide form and show success message
                form.classList.add('hidden'); 
                if (successMsg) {
                    successMsg.classList.remove('hidden');
                    successMsg.style.display = "block";
                }
            }
        })
        .catch((error) => {
            alert("Oops! Something went wrong. Please try again.");
        });
    });
}

    //mobile menu toggle//
    const menu = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menu) {
        // Toggle menu on icon click
        menu.addEventListener('click', () => {
            menu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        links.forEach(n => n.addEventListener('click', () => {
            menu.classList.remove('active');
            navLinks.classList.remove('active');
        }));
    }

    const navHeight = document.querySelector('nav').offsetHeight;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.height = `calc(100dvh - ${navHeight}px)`;
    }
});

const PASS_CEREMONY = "Q0VSRU1PTlkxNjUyNg==";
const PASS_EVENING = "RVZFTklORzE2NTI2";

function checkPassword() {
    const input = document.getElementById('pass-input').value.trim().toUpperCase();
    const error = document.getElementById('pass-error');
    
    if (btoa(input) === PASS_CEREMONY) {
        unlockSite('ceremony');
    } else if (btoa(input) === PASS_EVENING) {
        unlockSite('evening');
    } else {
        error.style.display = 'block';
    }
}

function unlockSite(type) {
    // 1. Reveal the main site
    document.getElementById('password-gateway').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden-content');

    const ceremonyBlock = document.getElementById('ceremony-block');
    const receptionTime = document.getElementById('reception-time');

    // Handle Day-Only content (Q&A, specific text)
    const dayOnlyElements = document.querySelectorAll('.day-only');
    dayOnlyElements.forEach(el => {
        if (type === 'evening') {
            el.classList.add('hidden');
        } else {
            el.classList.remove('hidden');
        }
    });

    if (type === 'evening') {
        // --- EVENING GUESTS ---
        // Hide the Ceremony block
        if (ceremonyBlock) ceremonyBlock.classList.add('hidden');
        
        // Ensure time is visible and set to 18:00
        if (receptionTime) {
            receptionTime.innerText = '18:00';
            receptionTime.classList.remove('hidden');
        }
    } else {
        // --- DAY GUESTS ---
        // Ensure Ceremony block is visible
        if (ceremonyBlock) ceremonyBlock.classList.remove('hidden');
        
        // RECEPTION TIME LOGIC CHANGED HERE:
        // Show 14:00 instead of hiding it
        if (receptionTime) {
            receptionTime.innerText = '14:00';
            receptionTime.classList.remove('hidden');
        }
    }

    localStorage.setItem('wedding_access', type);
}
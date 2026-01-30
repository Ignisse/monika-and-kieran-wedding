// script.js

// --- 1. RSVP LOGIC (Global Functions) ---
function toggleRSVP(isAttending) {
    // 1. Grab the elements by their NEW IDs
    const guestFields = document.getElementById('guest-fields');
    const noteFields = document.getElementById('note-fields');
    const notesLabel = document.getElementById('notes-label');
    const guestInput = document.getElementById('guests');

    // 2. Always show the Notes field (once they click a button)
    if (noteFields) noteFields.classList.remove('hidden');

    if (isAttending) {
        // --- YES ---
        // Show Guest Count
        if (guestFields) guestFields.classList.remove('hidden');
        // Make it required
        if (guestInput) guestInput.setAttribute('required', 'true');
        // Set label for Attendees
        if (notesLabel) notesLabel.innerText = "Dietary Restrictions, Song Requests, or Other Notes";
    } else {
        // --- NO ---
        // Hide Guest Count
        if (guestFields) guestFields.classList.add('hidden');
        // Make it NOT required (so they can submit)
        if (guestInput) guestInput.removeAttribute('required');
        // Set label for Regrets
        if (notesLabel) notesLabel.innerText = "Leave a note for the couple";
    }
}
function resetForm() {
    const form = document.querySelector("form[name='rsvp']");
    const successMsg = document.getElementById("rsvp-success");
    const guestFields = document.getElementById('guest-fields');
    const noteFields = document.getElementById('note-fields');
    const notesLabel = document.getElementById('notes-label');
    
    // Reset Form UI
    if (successMsg) {
        successMsg.classList.add('hidden'); 
        successMsg.style.display = "none";
    } 
    if (form) {
        form.reset();
        form.classList.remove('hidden');
    }
    
    // Reset to "Hidden" state using classes
    if (guestFields) guestFields.classList.add('hidden');
    if (noteFields) noteFields.classList.add('hidden');
    
    // Reset label text
    if (notesLabel) notesLabel.innerText = "Dietary Restrictions, Song Requests, or Other Notes";
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
                const isAttending = formData.get('attendance') === 'Yes';
                const mainText = document.getElementById("success-text");
                const subText = document.getElementById("success-subtext");
                
                // ADD THIS LINE:
                const successMsg = document.getElementById("rsvp-success"); 

                if (isAttending) {
                    mainText.innerText = "Your RSVP has been sent.";
                    subText.innerText = "We can't wait to see you!";
                } else {
                    mainText.innerText = "Thank you for letting us know.";
                    subText.innerText = "You will be missed!";
                }

                // Hide form and show success message
                form.classList.add('hidden'); 
                if (successMsg) {
                    successMsg.classList.remove('hidden');
                    successMsg.style.display = "block";
                }
            } // Closing if (response.ok)
        }) // Closing .then()
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
        
        // HIDE the reception time (implies continuous flow)
        if (receptionTime) receptionTime.classList.add('hidden');
    }

    localStorage.setItem('wedding_access', type);
}

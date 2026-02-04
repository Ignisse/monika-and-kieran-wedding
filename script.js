// !!! CRITICAL: PASTE YOUR GOOGLE SCRIPT URL BETWEEN THE QUOTES BELOW !!!

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4tob4fwwtwyLZlmufLZW_eZpbEaxB-xuSxTCNXlQ3RbBbo4bsI-HAwnsU_EaKdNziKg/exec"; 

function setLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('wedding_lang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    updateDynamicText(lang);
}

function updateDynamicText(lang) {
    const notesLabel = document.getElementById('notes-label');
    const nameInput = document.getElementById('full-name');
    const passInput = document.getElementById('pass-input');
    
    const yesRadio = document.querySelector('input[name="attendance"][value="Yes"]');
    const isAttending = yesRadio ? yesRadio.checked : false;
    
    if(notesLabel) {
        if (lang === 'sk') {
            notesLabel.innerText = isAttending ? "Diétne požiadavky alebo iné poznámky" : "Nechajte odkaz pre pár";
        } else {
            notesLabel.innerText = isAttending ? "Dietary Restrictions, Song Requests, or Other Notes" : "Leave a note for the couple";
        }
    }

    if(nameInput) {
        nameInput.placeholder = (lang === 'sk') ? "napr. Jana Nováková & Partner" : "e.g. Jane Doe & Plus One";
    }
    if(passInput) {
        passInput.placeholder = (lang === 'sk') ? "Vložte kód sem" : "Enter Code Here";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('wedding_lang') || 'en';
    setLanguage(savedLang);

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
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

   // --- GOOGLE SHEETS FORM SUBMISSION ---
   const form = document.querySelector("#rsvp-form");
   
   if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // 1. Check if URL is pasted
        if (GOOGLE_SCRIPT_URL.includes("PASTE_YOUR_URL") || GOOGLE_SCRIPT_URL === "") {
            alert("Configuration Error: Please paste your Google Web App URL in script.js line 3.");
            return;
        }

        const submitBtn = document.getElementById("submit-btn");
        const originalBtnText = submitBtn.innerText;
        
        // 2. Show Loading State
        submitBtn.disabled = true;
        submitBtn.innerText = document.documentElement.lang === 'sk' ? "Odosiela sa..." : "Sending...";

        const formData = new FormData(form);
        const isAttending = formData.get('attendance') === 'Yes';

        // 3. Send Data to Google Script (STANDARD MODE)
        // We removed 'no-cors', so we can now read the response.json()
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json()) // We expect JSON back from Google
        .then((data) => {
            if (data.result === 'success') {
                // SUCCESS LOGIC
                const successMsg = document.getElementById("rsvp-success");
                const msgYes = document.getElementById('msg-yes');
                const msgNo = document.getElementById('msg-no');
                
                // Reset visibility
                if (msgYes) msgYes.classList.add('hidden');
                if (msgNo) msgNo.classList.add('hidden');

                // Show correct message based on attendance
                if (isAttending && msgYes) {
                    msgYes.classList.remove('hidden');
                } else if (!isAttending && msgNo) {
                    msgNo.classList.remove('hidden');
                }

                // Hide form, show success
                form.classList.add('hidden'); 
                if (successMsg) {
                    successMsg.classList.remove('hidden');
                    successMsg.style.display = "block";
                }
            } else {
                // LOGICAL ERROR (Script ran, but returned 'error')
                throw new Error(data.error || 'Unknown script error');
            }
        })
        .catch((error) => {
            // NETWORK ERROR (CORS, Offline, or Script Crash)
            console.error('Submission Error:', error);
            alert("Something went wrong connecting to the server. Please try again.");
            
            // Reset button so they can try again
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        });
    });
}

    //mobile menu toggle
    const menu = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menu) {
        menu.addEventListener('click', () => {
            menu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
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

function toggleRSVP(isAttending) {
    const guestFields = document.getElementById('guest-fields');
    const noteFields = document.getElementById('note-fields');
    const guestInput = document.getElementById('guests');

    if (noteFields) noteFields.classList.remove('hidden');

    if (isAttending) {
        if (guestFields) guestFields.classList.remove('hidden');
        if (guestInput) guestInput.setAttribute('required', 'true');
    } else {
        if (guestFields) guestFields.classList.add('hidden');
        if (guestInput) guestInput.removeAttribute('required');
    }
    updateDynamicText(document.documentElement.lang);
}

function resetForm() {
    const form = document.querySelector("#rsvp-form");
    const successMsg = document.getElementById("rsvp-success");
    const guestFields = document.getElementById('guest-fields');
    const msgYes = document.getElementById('msg-yes');
    const msgNo = document.getElementById('msg-no');
    
    if (successMsg) {
        successMsg.classList.add('hidden'); 
        successMsg.style.display = "none";
    }
    
    if (msgYes) msgYes.classList.add('hidden');
    if (msgNo) msgNo.classList.add('hidden');

    if (form) {
        form.reset();
        form.classList.remove('hidden');
        form.style.display = ""; 
        const submitBtn = document.getElementById("submit-btn");
        submitBtn.disabled = false;
        // Reset button text based on lang
        submitBtn.innerText = document.documentElement.lang === 'sk' ? "Odoslať" : "Send RSVP";
    }
    
    if (guestFields) guestFields.classList.add('hidden');
    updateDynamicText(document.documentElement.lang);
}

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
    document.getElementById('password-gateway').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden-content');

    const ceremonyBlock = document.getElementById('ceremony-block');
    const receptionTime = document.getElementById('reception-time');

    const dayOnlyElements = document.querySelectorAll('.day-only');
    dayOnlyElements.forEach(el => {
        if (type === 'evening') {
            el.classList.add('hidden');
        } else {
            el.classList.remove('hidden');
        }
    });

    if (type === 'evening') {
        if (ceremonyBlock) ceremonyBlock.classList.add('hidden');
        if (receptionTime) {
            receptionTime.innerText = '18:00';
            receptionTime.classList.remove('hidden');
        }
    } else {
        if (ceremonyBlock) ceremonyBlock.classList.remove('hidden');
        if (receptionTime) {
            receptionTime.innerText = '14:00';
            receptionTime.classList.remove('hidden');
        }
    }
    localStorage.setItem('wedding_access', type);
}
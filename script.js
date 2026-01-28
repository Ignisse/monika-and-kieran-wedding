// script.js

// --- 1. RSVP LOGIC (Global Functions) ---
// Called directly by the HTML 'onclick' attributes
function toggleRSVP(isAttending) {
    const fields = document.getElementById('conditional-fields');
    const guestInput = document.getElementById('guests');

    if (isAttending) {
        fields.style.display = 'block';
        guestInput.setAttribute('required', 'true');
    } else {
        fields.style.display = 'none';
        guestInput.removeAttribute('required');
    }
}

function resetForm() {
    const form = document.querySelector("form[name='rsvp']");
    const successMsg = document.getElementById("rsvp-success");
    
    successMsg.style.display = "none";
    form.reset();
    form.style.display = "block";
    toggleRSVP(false); // Reset conditional fields
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
    const successMsg = document.getElementById("rsvp-success");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Stop page reload

            const formData = new FormData(form);

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            })
            .then(() => {
                form.style.display = "none";
                if(successMsg) successMsg.style.display = "block";
            })
            .catch((error) => {
                alert("Oops! Something went wrong. Please try again.");
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close');

    // Hide the modals initially (this is a safeguard, but the CSS should handle this)
    loginModal.style.display = "none";
    registerModal.style.display = "none";

    loginButton.onclick = function() {
        loginModal.style.display = "flex";
    }

    registerButton.onclick = function() {
        registerModal.style.display = "flex";
    }

    closeButtons.forEach(function(button) {
        button.onclick = function() {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        }
    });

    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
    }
});
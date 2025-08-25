document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay");
  const formContainer = document.querySelector(".form-container");
  const navSignInBtn = document.getElementById("navSignInBtn");

  // Open popup
  navSignInBtn.addEventListener("click", () => {
    overlay.classList.add("active");
    formContainer.classList.add("active");
  });

  // Close popup (click on overlay)
  overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
    formContainer.classList.remove("active");
  });

  // === SIGN IN FORM HANDLING ===
  const signInForm = formContainer.querySelector("form");
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = signInForm.querySelector("input[type='text']").value;
    const email = signInForm.querySelector("input[type='email']").value;

    // Save locally
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);

    // Save a flag to indicate "first login"
    localStorage.setItem("showWelcome", "true");

    // Redirect
    window.location.href = "index.html";  
  });

  // === GOOGLE SIGN IN HANDLING ===
  const googleBtn = formContainer.querySelector(".google-btn");
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Save dummy login
    localStorage.setItem("username", "Google User");
    localStorage.setItem("email", "user@gmail.com");

    // Save a flag to indicate "first login"
    localStorage.setItem("showWelcome", "true");

    // Redirect
    window.location.href = "index.html";  
  });
});
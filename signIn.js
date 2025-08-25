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

    //When user is logged in 
    localStorage.setItem("isLoggedIn", "true");

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

    //When user is logged in 
    localStorage.setItem("isLoggedIn", "true");
    // Save a flag to indicate "first login"
    localStorage.setItem("showWelcome", "true");

    // Redirect
    window.location.href = "index.html";  
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.getElementById("nav-links");
  const navSignInBtn = document.getElementById("navSignInBtn");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn && navLinks && navSignInBtn) {
    // Remove old Sign In button
    navSignInBtn.parentElement.remove();

    // Create Profile button
    const li = document.createElement("li");
    const profileBtn = document.createElement("button");
    profileBtn.className = "sign-in-btn";  // reuse styling
    profileBtn.innerHTML = '<img src="signinimg.png" class="sign-in-btnimg"> Profile';
    profileBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });

    li.appendChild(profileBtn);
    navLinks.appendChild(li);
  }
});

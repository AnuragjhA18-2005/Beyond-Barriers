const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  //To activate hamburger button
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
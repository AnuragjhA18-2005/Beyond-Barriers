const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  //To activate hamburger button
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });



// To change the style of nav on scrolling
const navbar = document.querySelector('header');
const navLinks1 = document.getElementById('nav-links');
const logo = document.querySelector('.logo');
window.addEventListener('scroll', () => {
    if (window.pageYOffset>navLinks1.offsetTop) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

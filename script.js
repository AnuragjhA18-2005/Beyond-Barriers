const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const cardContainer = document.getElementById('card-container');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

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

// How far to scroll: width of one card + gap
function getScrollAmount() {
  const card = cardContainer.querySelector('.card');
  if (card) {
    const cardStyle = window.getComputedStyle(card);
    const gap = parseInt(window.getComputedStyle(cardContainer).gap) || 0;
    return card.offsetWidth + gap;
  }
  return 200;
}

rightArrow.addEventListener('click', () => {
  cardContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
});

leftArrow.addEventListener('click', () => {
  cardContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
});

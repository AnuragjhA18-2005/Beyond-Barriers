const API_BASE =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'  // local Node server
    : '';                       // production: same-origin

// ============================
// UTILITIES
// ============================
const $ = (id) => document.getElementById(id);

function escapeHTML(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // Navbar (hamburger toggle)
  // ============================
  const menuToggle = $('menu-toggle');
  const navLinks = $('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // ============================
  // Card scroller
  // ============================
  const cardContainer = $('card-container');
  const leftArrow = $('left-arrow');
  const rightArrow = $('right-arrow');

  function scrollCards(direction = 1) {
    if (!cardContainer) return;
    const firstCard = cardContainer.querySelector('.card');
    const cardWidth = firstCard ? firstCard.offsetWidth : 300;
    const containerGap = parseInt(
      getComputedStyle(cardContainer).gap ||
      getComputedStyle(cardContainer).columnGap ||
      '16', 10
    );
    const step = cardWidth + (Number.isFinite(containerGap) ? containerGap : 16);
    cardContainer.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  if (leftArrow) leftArrow.addEventListener('click', () => scrollCards(-1));
  if (rightArrow) rightArrow.addEventListener('click', () => scrollCards(1));

  // ============================
  // Chatbot UI
  // ============================
  const chatButton = $('chatButton');
  const chatWidget = $('chatWidget');
  const closeChat = $('closeChat');
  const chatLog   = $('chatLog');
  const userInput = $('userInput');
  const sendBtn   = $('sendBtn');

  const openChat = () => {
    if (!chatWidget) return;
    chatWidget.style.display = 'flex';
    if (userInput) userInput.focus();
  };

  const closeChatWidget = () => {
    if (!chatWidget) return;
    chatWidget.style.display = 'none';
  };

  if (chatButton) chatButton.addEventListener('click', openChat);
  if (closeChat)  closeChat.addEventListener('click', closeChatWidget);

  function addLine(html) {
    if (!chatLog) return;
    chatLog.insertAdjacentHTML('beforeend', html);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function removeThinking() {
    if (!chatLog) return;
    const bots = chatLog.querySelectorAll('.bot');
    const lastBot = bots[bots.length - 1];
    if (lastBot && lastBot.classList.contains('thinking')) lastBot.remove();
  }

  function setSendingState(isSending) {
    if (sendBtn) sendBtn.disabled = isSending;
    if (userInput) userInput.disabled = isSending;
  }

  async function sendMessage(text) {
    if (!text || !chatLog) return;

    // Show user message
    addLine(`<div class="user"><strong>You:</strong> ${escapeHTML(text)}</div>`);
    // Show placeholder
    addLine(`<div class="bot thinking"><strong>Bot:</strong> <em>Thinking...</em></div>`);
    setSendingState(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      removeThinking();

      if (!res.ok) {
        let details = '';
        try { details = await res.text(); } catch (_) {}
        addLine(`<div class="bot"><strong>Bot:</strong> Chat service error (${res.status}). ${escapeHTML(details || '')}</div>`);
        return;
      }

      const data = await res.json().catch(() => ({}));
      const reply = data && data.reply ? data.reply : 'No response received.';
      addLine(`<div class="bot"><strong>Bot:</strong> ${escapeHTML(reply)}</div>`);
    } catch (err) {
      removeThinking();
      addLine(`<div class="bot"><strong>Bot:</strong> Couldn’t reach the chat service. Check that your server is running.</div>`);
      console.error('Chat error:', err);
    } finally {
      setSendingState(false);
    }
  }

  function wireSendControls() {
    if (!sendBtn || !userInput) return;

    sendBtn.addEventListener('click', () => {
      const text = userInput.value.trim();
      if (!text) return;
      sendMessage(text);
      userInput.value = '';
      userInput.focus();
    });

    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  wireSendControls();
});



//Make the hero section slidee with typing effect

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.querySelector(".hero-dots");
  let currentIndex = 0;
  let slideInterval;

  // Generate dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("hero-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".hero-dot");

  // Show slide + run Typed.js
  function showSlide(index) {
    slides[currentIndex].classList.remove("active");
    dots[currentIndex].classList.remove("active");

    currentIndex = index;
    slides[currentIndex].classList.add("active");
    dots[currentIndex].classList.add("active");

    // Clear old Typed instance if exists
    const typedElement = slides[currentIndex].querySelector(".typed-text");
    if (typedElement) {
      const strings = JSON.parse(typedElement.getAttribute("data-strings"));
      typedElement.innerHTML = ""; // Reset text
      new Typed(typedElement, {
        strings,
        typeSpeed: 55,
        backSpeed: 20,
        backDelay: 2000,
        loop: false,
      });
    }
  }

  // Auto cycle
  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 9000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  // Start first slide typed effect
  showSlide(0);
  startSlider();

  // Pause on hover
  const heroSlider = document.querySelector(".hero-slider");
  heroSlider.addEventListener("mouseenter", stopSlider);
  heroSlider.addEventListener("mouseleave", startSlider);
});

// const menuToggle = document.getElementById('menu-toggle');
// const navLinks = document.getElementById('nav-links');
// const cardContainer = document.getElementById('card-container');
// const leftArrow = document.getElementById('left-arrow');
// const rightArrow = document.getElementById('right-arrow');

// //To activate hamburger button
// menuToggle.addEventListener('click', () => {
// menuToggle.classList.toggle('active');
// navLinks.classList.toggle('active');
// });



// // To change the style of nav on scrolling
// const navbar = document.querySelector('header');
// const navLinks1 = document.getElementById('nav-links');
// const logo = document.querySelector('.logo');
// window.addEventListener('scroll', () => {
//     if (window.pageYOffset>navLinks1.offsetTop) {
//         navbar.classList.add('scrolled');
//     } else {
//         navbar.classList.remove('scrolled');
//     }
// });

// // How far to scroll: width of one card + gap
// function getScrollAmount() {
//   const card = cardContainer.querySelector('.card');
//   if (card) {
//     const cardStyle = window.getComputedStyle(card);
//     const gap = parseInt(window.getComputedStyle(cardContainer).gap) || 0;
//     return card.offsetWidth + gap;
//   }
//   return 200;
// }

// rightArrow.addEventListener('click', () => {
//   cardContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
// });

// leftArrow.addEventListener('click', () => {
//   cardContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
// });

// //adding chat bot //
// document.addEventListener("DOMContentLoaded", () => {
//   const chatButton = document.getElementById("chatButton");
//   const chatWidget = document.getElementById("chatWidget");
//   const closeChat = document.getElementById("closeChat");
//   const sendBtn = document.getElementById("sendBtn");
//   const userInput = document.getElementById("userInput");
//   const chatLog = document.getElementById("chatLog");

//   // Show chat
//   chatButton.addEventListener("click", () => {
//     chatWidget.style.display = "flex";
//     chatButton.style.display = "none";
//   });

//   // Close chat
//   closeChat.addEventListener("click", () => {
//     chatWidget.style.display = "none";
//     chatButton.style.display = "flex";
//   });

//   // **Updated sendMessage function with better error handling**
//   async function sendMessage(userText) {
//     if (!userText) return;

//     // Show user message
//     chatLog.innerHTML += `<div class="user"><strong>You:</strong> ${userText}</div>`;
//     chatLog.scrollTop = chatLog.scrollHeight;

//     // Show "thinking" message
//     chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> <em>Thinking...</em></div>`;
//     chatLog.scrollTop = chatLog.scrollHeight;

//     try {
//       console.log("Sending request to /api/chat with:", userText);
      
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userText })
//       });

//       console.log("Response status:", res.status);
//       console.log("Response ok:", res.ok);

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error("Server responded with error:", errorText);
//         throw new Error(`Server error: ${res.status} - ${errorText}`);
//       }

//       const data = await res.json();
//       console.log("Received data:", data);

//       // Remove "thinking" message
//       const botMessages = chatLog.querySelectorAll('.bot');
//       const lastBotMessage = botMessages[botMessages.length - 1];
//       if (lastBotMessage && lastBotMessage.textContent.includes('Thinking...')) {
//         lastBotMessage.remove();
//       }

//       // Add actual bot response
//       chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> ${data.reply || 'No response received'}</div>`;
//       chatLog.scrollTop = chatLog.scrollHeight;

//     } catch (err) {
//       console.error("Full error details:", err);
      
//       // Remove "thinking" message
//       const botMessages = chatLog.querySelectorAll('.bot');
//       const lastBotMessage = botMessages[botMessages.length - 1];
//       if (lastBotMessage && lastBotMessage.textContent.includes('Thinking...')) {
//         lastBotMessage.remove();
//       }

//       // Show detailed error message
//       let errorMessage = "Sorry, something went wrong.";
//       if (err.message.includes('404')) {
//         errorMessage = "Chat service not found. Make sure your API route is set up correctly.";
//       } else if (err.message.includes('500')) {
//         errorMessage = "Server error. Please check your API configuration.";
//       } else if (err.message.includes('Failed to fetch')) {
//         errorMessage = "Network error. Please check your internet connection.";
//       }
      
//       chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> ${errorMessage}</div>`;
//       chatLog.scrollTop = chatLog.scrollHeight;
//     }
//   }

//   // Button click
//   sendBtn.addEventListener("click", () => {
//     const text = userInput.value.trim();
//     if (text) {
//       sendMessage(text);
//       userInput.value = "";
//     }
//   });

//   // Enter key
//   userInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       sendBtn.click();
//     }
//   });
// });


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

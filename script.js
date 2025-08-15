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

//adding chat bot //

// Show/hide chat widget
const chatButton = document.getElementById("chatButton");
const chatWidget = document.getElementById("chatWidget");
const closeChat = document.getElementById("closeChat");

chatButton.addEventListener("click", () => {
  chatWidget.style.display = "flex";
  chatButton.style.display = "none";
});

closeChat.addEventListener("click", () => {
  chatWidget.style.display = "none";
  chatButton.style.display = "flex";
});

// Chat sending logic
async function sendMessage(userText) {
  const chatLog = document.getElementById("chatLog");
  chatLog.innerHTML += `<div class="user"><strong>You:</strong> ${userText}</div>`;
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: userText }]
      })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> ${data.reply}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
  } catch (err) {
    console.error(err);
    chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> Sorry, something went wrong.</div>`;
  }
}

document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (text) {
    sendMessage(text);
    input.value = "";
  }
});

document.getElementById("userInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("sendBtn").click();
  }
});

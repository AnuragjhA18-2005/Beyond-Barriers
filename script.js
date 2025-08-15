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
document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.getElementById("chatButton");
  const chatWidget = document.getElementById("chatWidget");
  const closeChat = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatLog = document.getElementById("chatLog");

  // Show chat
  chatButton.addEventListener("click", () => {
    chatWidget.style.display = "flex";
    chatButton.style.display = "none";
  });

  // Close chat
  closeChat.addEventListener("click", () => {
    chatWidget.style.display = "none";
    chatButton.style.display = "flex";
  });

  // Send message function
  async function sendMessage(userText) {
    if (!userText) return;

    // Show user message
    chatLog.innerHTML += `<div class="user"><strong>You:</strong> ${userText}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          model: "deepseek-v1",
          messages: [{ role: "user", content: userText }]
        })
      });

      if (!response.ok) throw new Error("Network response was not OK");

      const data = await response.json();

      // Display bot reply
      const botReply = data.choices[0].message.content;
      chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> ${botReply}</div>`;
      chatLog.scrollTop = chatLog.scrollHeight;

    } catch (err) {
      console.error(err);
      chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> Sorry, something went wrong.</div>`;
    }
  }

  // Button click
  sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (text) {
      sendMessage(text);
      userInput.value = "";
    }
  });

  // Enter key
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });
});

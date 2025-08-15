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
// ... all your existing code (menuToggle, navbar scroll, arrows, etc.) ...

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

  // **Updated sendMessage function with better error handling**
  async function sendMessage(userText) {
    if (!userText) return;

    // Show user message
    chatLog.innerHTML += `<div class="user"><strong>You:</strong> ${userText}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;

    // Show "thinking" message
    chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> <em>Thinking...</em></div>`;
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
      console.log("Sending request to /api/chat with:", userText);
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server responded with error:", errorText);
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("Received data:", data);

      // Remove "thinking" message
      const botMessages = chatLog.querySelectorAll('.bot');
      const lastBotMessage = botMessages[botMessages.length - 1];
      if (lastBotMessage && lastBotMessage.textContent.includes('Thinking...')) {
        lastBotMessage.remove();
      }

      // Add actual bot response
      chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> ${data.reply || 'No response received'}</div>`;
      chatLog.scrollTop = chatLog.scrollHeight;

    } catch (err) {
      console.error("Full error details:", err);
      
      // Remove "thinking" message
      const botMessages = chatLog.querySelectorAll('.bot');
      const lastBotMessage = botMessages[botMessages.length - 1];
      if (lastBotMessage && lastBotMessage.textContent.includes('Thinking...')) {
        lastBotMessage.remove();
      }

      // Show detailed error message
      let errorMessage = "Sorry, something went wrong.";
      if (err.message.includes('404')) {
        errorMessage = "Chat service not found. Make sure your API route is set up correctly.";
      } else if (err.message.includes('500')) {
        errorMessage = "Server error. Please check your API configuration.";
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      chatLog.innerHTML += `<div class="bot"><strong>Bot:</strong> ${errorMessage}</div>`;
      chatLog.scrollTop = chatLog.scrollHeight;
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

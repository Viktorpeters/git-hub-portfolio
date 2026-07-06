// ============================================================
// VIKTOR AI — CHAT WIDGET
// Ported from the Next.js ChatWidget component to vanilla JS
// so it can run on static GitHub Pages hosting.
// ============================================================

// ------------------------------------------------------------
// >>> TODO: SET THIS TO YOUR LIVE API BASE URL <<<
// This must match a domain listed in your backend's CORS
// `origin` array (see main.ts enableCors config), e.g.:
//   origin: [
//     'http://localhost:3000',
//     'https://<your-username>.github.io'   <-- your new GitHub Pages URL
//   ]
// Note: victorajayidamilare.tech is going offline soon — remove it
// from your backend's CORS origin array too, or requests from a
// dead domain will just sit there uselessly.
// Without the correct origin listed, the browser will block every
// request below with a CORS error, even though the endpoint itself
// is fine.
// ------------------------------------------------------------
const API_URL = "https://REPLACE-WITH-YOUR-API-DOMAIN.com";

(function () {
  const bubble = document.getElementById("chatBubble");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatClose");
  const messagesEl = document.getElementById("chatMessages");
  const inputEl = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");

  let messages = [
    {
      role: "assistant",
      content:
        "Hey, I'm Viktor's AI. Ask me anything about his work, projects, or experience.",
    },
  ];
  let isLoading = false;
  let isOpen = false;

  function renderMessages() {
    messagesEl.innerHTML = "";
    messages.forEach((msg, i) => {
      const bubbleEl = document.createElement("div");
      bubbleEl.className = `chat__msg chat__msg--${msg.role}`;

      if (
        msg.role === "assistant" &&
        msg.content === "" &&
        isLoading &&
        i === messages.length - 1
      ) {
        bubbleEl.innerHTML =
          '<span class="chat__typing"><span></span><span></span><span></span></span>';
      } else {
        bubbleEl.textContent = msg.content;
      }
      messagesEl.appendChild(bubbleEl);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function openChat() {
    isOpen = true;
    panel.hidden = false;
    bubble.style.display = "none";
    renderMessages();
    setTimeout(() => inputEl.focus(), 200);
  }

  function closeChat() {
    isOpen = false;
    panel.hidden = true;
    bubble.style.display = "flex";
  }

  bubble.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);

  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + "px";
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = "";
    inputEl.style.height = "auto";

    messages.push({ role: "user", content: text });
    isLoading = true;
    sendBtn.disabled = true;
    messages.push({ role: "assistant", content: "" });
    renderMessages();

    try {
      const history = messages
        .slice(1, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      const reply = data.reply || "Sorry, I didn't catch that.";

      await revealReply(reply);
    } catch (err) {
      messages[messages.length - 1] = {
        role: "assistant",
        content:
          "Viktor's assistant is taking a break right now — feel free to email him directly instead.",
      };
      isLoading = false;
      sendBtn.disabled = false;
      renderMessages();
    }
  }

  function revealReply(fullText) {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= fullText.length) {
          messages[messages.length - 1] = {
            role: "assistant",
            content: fullText.slice(0, i),
          };
          renderMessages();
          i++;
        } else {
          clearInterval(interval);
          isLoading = false;
          sendBtn.disabled = false;
          resolve();
        }
      }, 12);
    });
  }

  renderMessages();
})();

// ============================================================
// Chat widget — talks to portfolio-chat-worker on Cloudflare.
// Reveals replies word-by-word (not real token streaming, but
// visually the same effect) so it reads like a typed response
// instead of dumping the whole answer in one go.
// ============================================================

const CHAT_WORKER_URL =
  "https://portfolio-chat-worker.alternativeschool073.workers.dev";

const chatToggle = document.getElementById("chatToggle");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

let hasIntroduced = false;
let conversationHistory = []; // { role: 'user'|'assistant', content: string }[]

function scrollMessagesToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessageBubble(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `chat-msg chat-msg--${role}`;
  bubble.textContent = text; // FIX: this was missing — text was being silently discarded
  chatMessages.appendChild(bubble);
  scrollMessagesToBottom();
  return bubble;
}

function addTypingIndicator() {
  const el = document.createElement("div");
  el.className = "chat-typing";
  el.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(el);
  scrollMessagesToBottom();
  return el;
}

// Reveals text into a bubble one word at a time, each word fading in
// via CSS transition rather than snapping into place instantly, so it
// reads like a deliberate typed response rather than a fast dump.
function revealTextIntoBubble(bubble, fullText, delayMs = 100) {
  const words = fullText.split(" ");
  let i = 0;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const span = document.createElement("span");
      span.className = "chat-word";
      span.textContent = (i === 0 ? "" : " ") + words[i];
      bubble.appendChild(span);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => span.classList.add("chat-word--in"));
      });
      i += 1;
      scrollMessagesToBottom();
      if (i >= words.length) {
        clearInterval(interval);
        resolve();
      }
    }, delayMs);
  });
}

function openChat() {
  chatPanel.classList.add("is-open");
  chatPanel.setAttribute("aria-hidden", "false");
  chatToggle.setAttribute("aria-expanded", "true");

  if (!hasIntroduced) {
    hasIntroduced = true;
    const introText =
      "Hey, good to have you here. I build backend systems, AI systems, and cloud infrastructure, feel free to ask me anything about my work, my projects, or how to reach me.";
    const bubble = addMessageBubble("assistant", "");
    revealTextIntoBubble(bubble, introText, 100).then(() => {
      conversationHistory.push({ role: "assistant", content: introText });
    });
  }

  setTimeout(() => chatInput.focus(), 260);
}

function closeChat() {
  chatPanel.classList.remove("is-open");
  chatPanel.setAttribute("aria-hidden", "true");
  chatToggle.setAttribute("aria-expanded", "false");
}

if (chatToggle) {
  chatToggle.addEventListener("click", () => {
    chatPanel.classList.contains("is-open") ? closeChat() : openChat();
  });
}
if (chatClose) {
  chatClose.addEventListener("click", closeChat);
}

if (chatForm) {
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    addMessageBubble("user", message);
    chatInput.value = "";
    chatInput.disabled = true;

    const typingEl = addTypingIndicator();

    try {
      const res = await fetch(CHAT_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: conversationHistory }),
      });

      if (!res.ok) throw new Error("Worker request failed");

      const data = await res.json();
      const reply =
        data.reply || "Sorry, I couldn't put a reply together just now.";

      typingEl.remove();
      const bubble = addMessageBubble("assistant", "");
      await revealTextIntoBubble(bubble, reply, 100);

      conversationHistory.push({ role: "user", content: message });
      conversationHistory.push({ role: "assistant", content: reply });
    } catch (err) {
      console.error("Chat request failed:", err);
      typingEl.remove();
      addMessageBubble(
        "error",
        "Couldn't reach me right now, try again in a moment, or reach out directly at +2348143324603 or victorajayidamilare@gmail.com.",
      );
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
    }
  });
}

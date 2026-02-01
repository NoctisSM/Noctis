/**
 * Waffle Chat Widget - Vanilla JS Version
 * For static HTML sites without React/Next.js
 */

class WaffleChat {
  constructor(options = {}) {
    this.apiEndpoint = options.apiEndpoint || '/api/chat';
    this.buttonText = options.buttonText || 'Waffle';
    this.initialMessage = options.initialMessage || "Hi! Ask me about my work, projects, or experience.";
    this.messages = [{ role: 'assistant', content: this.initialMessage }];
    this.isLoading = false;
    this.isOpen = false;

    this.init();
  }

  init() {
    this.injectStyles();
    this.createWidget();
    this.bindEvents();
  }

  injectStyles() {
    if (document.getElementById('waffle-chat-styles')) return;

    const link = document.createElement('link');
    link.id = 'waffle-chat-styles';
    link.rel = 'stylesheet';
    link.href = 'js/chat-widget.css';
    document.head.appendChild(link);
  }

  createWidget() {
    // Create trigger button
    this.trigger = document.createElement('button');
    this.trigger.className = 'chat-widget-trigger';
    this.trigger.setAttribute('aria-label', 'Open chat');
    this.trigger.innerHTML = `
      <span class="chat-widget-trigger-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </span>
      <span class="chat-widget-trigger-text">${this.buttonText}</span>
    `;

    // Create modal overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'chat-widget-overlay hidden';
    this.overlay.innerHTML = `
      <div class="chat-widget-modal" role="dialog" aria-modal="true" aria-labelledby="chat-title">
        <div class="chat-widget-header">
          <h2 id="chat-title" class="chat-widget-title">Waffle</h2>
          <button class="chat-widget-close" aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="chat-widget-messages"></div>
        <div class="chat-widget-input-container">
          <input type="text" class="chat-widget-input" placeholder="Type a message..." aria-label="Chat message input">
          <button class="chat-widget-send" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Cache DOM elements
    this.modal = this.overlay.querySelector('.chat-widget-modal');
    this.closeBtn = this.overlay.querySelector('.chat-widget-close');
    this.messagesContainer = this.overlay.querySelector('.chat-widget-messages');
    this.input = this.overlay.querySelector('.chat-widget-input');
    this.sendBtn = this.overlay.querySelector('.chat-widget-send');

    // Append to DOM
    document.body.appendChild(this.overlay);

    // Render initial message
    this.renderMessages();
  }

  bindEvents() {
    this.trigger.addEventListener('click', () => this.open());
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    this.isOpen = true;
    this.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.input.focus();
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  renderMessages() {
    this.messagesContainer.innerHTML = this.messages.map((msg, i) => `
      <div class="chat-widget-message chat-widget-message-${msg.role}">
        <div class="chat-widget-message-content">${this.escapeHtml(msg.content)}</div>
      </div>
    `).join('');

    if (this.isLoading && this.messages[this.messages.length - 1]?.role !== 'assistant') {
      this.messagesContainer.innerHTML += `
        <div class="chat-widget-message chat-widget-message-assistant">
          <div class="chat-widget-message-content">
            <div class="chat-widget-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      `;
    }

    this.scrollToBottom();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.input.disabled = loading;
    this.sendBtn.disabled = loading;
  }

  async sendMessage() {
    const text = this.input.value.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', content: text });
    this.input.value = '';
    this.setLoading(true);
    this.renderMessages();

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this.messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      this.messages.push({ role: 'assistant', content: '' });
      this.renderMessages();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                this.messages[this.messages.length - 1].content += parsed.content;
                this.renderMessages();
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      this.messages.push({
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      });
      this.renderMessages();
    } finally {
      this.setLoading(false);
    }
  }

  // Mount trigger button to a specific element
  mount(selector) {
    const container = document.querySelector(selector);
    if (container) {
      container.appendChild(this.trigger);
    } else {
      console.warn(`WaffleChat: Element "${selector}" not found`);
    }
  }

  // Get the trigger button to manually append
  getTrigger() {
    return this.trigger;
  }
}

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const autoInit = document.querySelector('[data-waffle-chat]');
  if (autoInit) {
    const chat = new WaffleChat({
      apiEndpoint: autoInit.dataset.apiEndpoint,
      buttonText: autoInit.dataset.buttonText,
      initialMessage: autoInit.dataset.initialMessage,
    });
    chat.mount('[data-waffle-chat]');
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WaffleChat;
}

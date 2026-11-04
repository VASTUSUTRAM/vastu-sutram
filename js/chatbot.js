/**
 * VASTU SUTRAM – 24/7 Intelligent AI Customer Support Agent
 * Representing: Rajni Singh – Senior Vastu Consultant
 * Brand: Vastu Sutram – The Principles of Vastu
 * Supports: English, Hindi (Devanagari) & Hinglish (Roman Hindi)
 */

class VastuAIChatbot {
  constructor() {
    this.storageKey = 'vastu_sutram_ai_chat_session_v1';
    this.isOpen = false;
    this.isTyping = false;
    this.language = 'auto'; // 'auto' | 'en' | 'hi' | 'hinglish'
    this.messages = [];
    this.bookingMode = false;
    this.bookingStepIndex = 0;
    this.bookingDraft = {
      fullName: '',
      whatsapp: '',
      email: '',
      city: '',
      propertyType: 'Independent House / Apartment',
      category: 'Residential Vastu',
      packageName: 'Complete Home Vastu Analysis (Starting from ₹11,000)',
      mode: 'Online Video Consultation',
      requirement: '',
      preferredDateTime: ''
    };

    // Primary WhatsApp numbers (supports both +91 81457 15755 from prompt & +91 91814 57155)
    this.chatbotWhatsAppNumber = '918145715755';
    this.chatbotWhatsAppDisplay = '+91 81457 15755';

    this.initialQuickReplies = [
      'Explore Vastu Services',
      'Consultation Packages & Pricing',
      'Basic Vastu Questions',
      'Book a Consultation',
      'Talk to a Human Consultant'
    ];

    this.welcomeMessageText =
`Namaste! Welcome to Vastu Sutram.

I am your AI Vastu Assistant, available 24/7 to help you understand Vastu principles, explore our consultation services and answer your questions.

Whether you are planning a new home, improving your existing space or looking for professional Vastu guidance, I am here to help.

How may I assist you today?`;

    this.init();
  }

  init() {
    this.loadSession();
    this.injectWidgetDOM();
    this.bindEvents();
    this.renderMessages();
    this.checkBackendAIStatus();
  }

  loadSession() {
    try {
      const saved = sessionStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          this.messages = parsed.messages;
        }
        if (parsed.language) {
          this.language = parsed.language;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    if (this.messages.length === 0) {
      this.messages.push({
        id: 'msg-welcome',
        role: 'assistant',
        content: this.welcomeMessageText,
        timestamp: this.getFormattedTime(),
        quickReplies: this.initialQuickReplies
      });
    }
  }

  saveSession() {
    try {
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify({
          language: this.language,
          messages: this.messages.slice(-30)
        })
      );
    } catch (e) {
      // Ignore storage quota issues
    }
  }

  getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async checkBackendAIStatus() {
    try {
      const res = await fetch('/api/chat/status');
      if (res.ok) {
        const data = await res.json();
        this.llmConnected = Boolean(data.llmConnected);
        this.activeProvider = data.activeProvider || '';
      }
    } catch (e) {
      this.llmConnected = false;
    }
  }

  injectWidgetDOM() {
    if (document.getElementById('vastu-ai-chatbot-root')) return;

    const root = document.createElement('div');
    root.id = 'vastu-ai-chatbot-root';
    root.innerHTML = `
      <!-- Subtle 24/7 Availability Callout Bubble Outside Chat Window -->
      <div id="vastu-ai-tooltip-pill" class="vastu-ai-tooltip-pill" role="status">
        <button type="button" id="vastu-ai-tooltip-open" class="flex items-center gap-2.5 text-left focus:outline-none">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
          <span class="text-[11px] font-serif text-[#F8F3E9] tracking-wide leading-tight">
            Have a question? <strong class="text-[#F9E29B]">Your Vastu Assistant is available 24/7.</strong>
          </span>
        </button>
        <button type="button" id="vastu-ai-tooltip-dismiss" class="text-[#C6A15B]/70 hover:text-[#F9E29B] text-xs pl-1.5" aria-label="Dismiss notice">✕</button>
      </div>

      <!-- Circular Floating AI Chatbot Launcher Button -->
      <button
        type="button"
        id="vastu-ai-launcher-btn"
        class="vastu-ai-launcher-btn group"
        aria-label="Open Vastu Sutram 24/7 AI Assistant"
        aria-expanded="false"
      >
        <span class="vastu-ai-pulse-ring"></span>
        <div class="relative w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-[#1A0B10] border border-[#F9E29B]/60 p-1">
          <img
            src="assets/logo-emblem.png"
            alt="Vastu Sutram AI Assistant"
            class="w-full h-full object-contain original-brand-logo group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <!-- Online Notification Dot -->
        <span class="vastu-ai-online-badge" title="Available 24/7"></span>
      </button>

      <!-- Luxury Glassmorphism Chat Window -->
      <section
        id="vastu-ai-chat-window"
        class="vastu-ai-chat-window hidden"
        role="dialog"
        aria-label="Vastu Sutram AI Assistant Chat Window"
      >
        <!-- Top Header Bar -->
        <header class="vastu-ai-header px-4 py-3.5 flex items-center justify-between border-b border-[#C6A15B]/30">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative w-10 h-10 rounded-full bg-[#12080B] border border-[#F9E29B]/65 p-1 shrink-0 shadow-[0_0_15px_rgba(198,161,91,0.3)]">
              <img src="assets/logo-emblem.png" alt="Vastu Sutram Logo" class="w-full h-full object-contain original-brand-logo" />
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#180C10]"></span>
            </div>
            <div class="truncate">
              <div class="flex items-center gap-1.5">
                <h3 class="font-serif text-sm font-bold text-[#F9E29B] tracking-wide truncate">Vastu Sutram AI Assistant</h3>
              </div>
              <p class="text-[10px] text-[#DCCBB0] truncate">
                24/7 Support • Representing <strong class="text-[#F8F3E9]">Rajni Singh</strong>
              </p>
            </div>
          </div>

          <!-- Header Controls: Language Selector, Restart, Minimize -->
          <div class="flex items-center gap-1.5 shrink-0">
            <select
              id="vastu-ai-lang-select"
              class="bg-[#12080B]/90 border border-[#C6A15B]/45 text-[#F9E29B] text-[10px] font-serif rounded-full px-2 py-1 focus:outline-none cursor-pointer"
              title="Switch Conversation Language"
              aria-label="Conversation Language"
            >
              <option value="auto">🌐 Auto</option>
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="hinglish">Hinglish</option>
            </select>

            <button
              type="button"
              id="vastu-ai-restart-btn"
              class="w-7 h-7 rounded-full bg-[#12080B]/70 border border-[#C6A15B]/35 text-[#DCCBB0] hover:text-[#F9E29B] hover:border-[#F9E29B] flex items-center justify-center text-xs transition-all"
              title="Clear & Restart Conversation"
              aria-label="Clear and restart chat"
            >
              ↺
            </button>

            <button
              type="button"
              id="vastu-ai-close-btn"
              class="w-7 h-7 rounded-full bg-[#12080B]/70 border border-[#C6A15B]/35 text-[#DCCBB0] hover:text-[#F9E29B] hover:border-[#F9E29B] flex items-center justify-center text-xs font-bold transition-all"
              title="Minimize Chat"
              aria-label="Minimize chat window"
            >
              ✕
            </button>
          </div>
        </header>

        <!-- Sub-Header Quick Action Strip -->
        <div class="px-4 py-2 bg-[#12080B]/85 border-b border-[#C6A15B]/20 flex items-center justify-between gap-2 text-[10px]">
          <button
            type="button"
            id="vastu-ai-start-booking-btn"
            class="px-2.5 py-1 rounded-full bg-[#481C25]/80 hover:bg-[#C6A15B] text-[#F9E29B] hover:text-[#16070B] border border-[#C6A15B]/45 font-serif uppercase tracking-wider font-semibold transition-all"
          >
            📅 Guided Booking
          </button>
          <a
            href="https://api.whatsapp.com/send?phone=918145715755&text=Namaste%20Vastu%20Sutram%2C%20I%20would%20like%20to%20consult%20with%20Rajni%20Singh."
            target="_blank"
            rel="noopener noreferrer"
            class="px-2.5 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-700 text-emerald-300 hover:text-white border border-emerald-500/40 font-serif uppercase tracking-wider font-semibold transition-all flex items-center gap-1"
          >
            <span>💬</span>
            <span>Connect on WhatsApp</span>
          </a>
        </div>

        <!-- Scrollable Messages Stream -->
        <div id="vastu-ai-messages" class="vastu-ai-messages p-4 space-y-4 overflow-y-auto flex-1" aria-live="polite">
          <!-- Rendered dynamically -->
        </div>

        <!-- Typing Indicator -->
        <div id="vastu-ai-typing" class="hidden px-4 py-2 bg-[#160B0F]/90 border-t border-[#C6A15B]/15">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#241017] border border-[#C6A15B]/30 text-[11px] text-[#DCCBB0]">
            <span class="font-serif text-[#F9E29B]">Vastu Assistant is typing</span>
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#F9E29B] animate-bounce"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-bounce" style="animation-delay:0.15s"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#F9E29B] animate-bounce" style="animation-delay:0.3s"></span>
            </span>
          </div>
        </div>

        <!-- Bottom Input Composer -->
        <form id="vastu-ai-input-form" class="p-3 bg-[#12080B]/95 border-t border-[#C6A15B]/30 flex items-center gap-2">
          <input
            type="text"
            id="vastu-ai-input"
            placeholder="Ask in English, हिंदी or Hinglish..."
            autocomplete="off"
            class="flex-1 bg-[#1D0E13] border border-[#C6A15B]/40 focus:border-[#F9E29B] rounded-full px-4 py-2.5 text-xs text-[#F8F3E9] placeholder-[#DCCBB0]/55 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            id="vastu-ai-send-btn"
            class="w-10 h-10 rounded-full bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] text-[#16070B] flex items-center justify-center font-bold shadow-[0_4px_15px_rgba(217,165,45,0.4)] hover:scale-105 transition-transform shrink-0"
            aria-label="Send message"
          >
            ➤
          </button>
        </form>
      </section>
    `;

    document.body.appendChild(root);

    const langSelect = document.getElementById('vastu-ai-lang-select');
    if (langSelect) {
      langSelect.value = this.language;
    }
  }

  bindEvents() {
    const launcherBtn = document.getElementById('vastu-ai-launcher-btn');
    const closeBtn = document.getElementById('vastu-ai-close-btn');
    const restartBtn = document.getElementById('vastu-ai-restart-btn');
    const tooltipOpen = document.getElementById('vastu-ai-tooltip-open');
    const tooltipDismiss = document.getElementById('vastu-ai-tooltip-dismiss');
    const tooltipPill = document.getElementById('vastu-ai-tooltip-pill');
    const form = document.getElementById('vastu-ai-input-form');
    const input = document.getElementById('vastu-ai-input');
    const langSelect = document.getElementById('vastu-ai-lang-select');
    const startBookingBtn = document.getElementById('vastu-ai-start-booking-btn');

    if (launcherBtn) {
      launcherBtn.addEventListener('click', () => this.toggleChat());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggleChat(false));
    }
    if (tooltipOpen) {
      tooltipOpen.addEventListener('click', () => this.toggleChat(true));
    }
    if (tooltipDismiss && tooltipPill) {
      tooltipDismiss.addEventListener('click', (e) => {
        e.stopPropagation();
        tooltipPill.classList.add('hidden');
      });
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartConversation());
    }
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.language = e.target.value;
        this.saveSession();
      });
    }
    if (startBookingBtn) {
      startBookingBtn.addEventListener('click', () => {
        this.startInteractiveBookingFlow();
      });
    }
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text || this.isTyping) return;
        input.value = '';
        this.handleUserInput(text);
      });
    }
  }

  toggleChat(forceState) {
    const chatWindow = document.getElementById('vastu-ai-chat-window');
    const launcherBtn = document.getElementById('vastu-ai-launcher-btn');
    const tooltipPill = document.getElementById('vastu-ai-tooltip-pill');
    if (!chatWindow) return;

    this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;

    if (this.isOpen) {
      chatWindow.classList.remove('hidden');
      if (tooltipPill) tooltipPill.classList.add('hidden');
      if (launcherBtn) launcherBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        this.scrollToBottom();
        const input = document.getElementById('vastu-ai-input');
        if (input) input.focus();
      }, 80);
    } else {
      chatWindow.classList.add('hidden');
      if (launcherBtn) launcherBtn.setAttribute('aria-expanded', 'false');
    }
  }

  restartConversation() {
    this.bookingMode = false;
    this.bookingStepIndex = 0;
    this.messages = [
      {
        id: 'msg-' + Date.now(),
        role: 'assistant',
        content: this.welcomeMessageText,
        timestamp: this.getFormattedTime(),
        quickReplies: this.initialQuickReplies
      }
    ];
    this.saveSession();
    this.renderMessages();
  }

  formatMarkdownSafe(text = '') {
    const escaped = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#F9E29B] font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-[#EADCC9]">$1</em>')
      .replace(/\n/g, '<br/>');
  }

  renderMessages() {
    const container = document.getElementById('vastu-ai-messages');
    if (!container) return;

    container.innerHTML = this.messages.map((m, idx) => {
      const isUser = m.role === 'user';
      const quickRepliesHtml = !isUser && Array.isArray(m.quickReplies) && m.quickReplies.length > 0
        ? `
          <div class="flex flex-wrap gap-1.5 mt-3">
            ${m.quickReplies.map(qr => `
              <button
                type="button"
                data-chat-quick-reply="${qr.replace(/"/g, '&quot;')}"
                class="px-3 py-1.5 rounded-full text-[11px] font-serif bg-[#35131C]/90 hover:bg-[#C6A15B] text-[#F9E29B] hover:text-[#16070B] border border-[#C6A15B]/45 transition-all text-left shadow-sm"
              >
                ${qr}
              </button>
            `).join('')}
          </div>
        `
        : '';

      // Package pre-fill button if recommendedPackageId is attached
      let packageCardHtml = '';
      if (!isUser && m.recommendedPackageId && window.VASTU_DATA && Array.isArray(VASTU_DATA.packages)) {
        const pkg = VASTU_DATA.packages.find(p => p.id === m.recommendedPackageId);
        if (pkg) {
          packageCardHtml = `
            <div class="mt-3 p-3 rounded-xl bg-[#12080B]/90 border border-[#C6A15B]/45 space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] uppercase tracking-wider text-[#C6A15B] font-bold">${pkg.duration}</span>
                <span class="font-serif text-xs font-bold text-[#F9E29B]">${pkg.price}</span>
              </div>
              <div class="font-serif text-xs font-bold text-[#F8F3E9]">${pkg.name}</div>
              <button
                type="button"
                data-chat-book-pkg="${pkg.id}"
                class="w-full py-2 rounded-full bg-gradient-to-r from-[#D9A52D] via-[#F9E29B] to-[#C6A15B] text-[#16070B] font-serif text-[10px] font-bold uppercase tracking-wider shadow hover:brightness-105 transition-all"
              >
                BOOK THIS PACKAGE ➔
              </button>
            </div>
          `;
        }
      }

      // Human Consultant WhatsApp button if requested
      const whatsappConnectHtml = !isUser && m.showWhatsAppConnect
        ? `
          <div class="mt-3">
            <a
              href="https://api.whatsapp.com/send?phone=${this.chatbotWhatsAppNumber}&text=${encodeURIComponent('Namaste Vastu Sutram, I would like to connect with Senior Vastu Consultant Rajni Singh for personalised Vastu assistance.')}"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-serif text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>💬</span>
              <span>CONNECT ON WHATSAPP (${this.chatbotWhatsAppDisplay})</span>
            </a>
          </div>
        `
        : '';

      // Booking Summary WhatsApp Dispatch button
      const bookingDispatchHtml = !isUser && m.whatsappBookingUrl
        ? `
          <div class="mt-3 space-y-2">
            <a
              href="${m.whatsappBookingUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-serif text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>💬</span>
              <span>SEND TO WHATSAPP (${this.chatbotWhatsAppDisplay}) ➔</span>
            </a>
            <p class="text-[10px] text-[#DCCBB0]/80 text-center">
              Please click the button above to send your enquiry on WhatsApp so our team can confirm your slot.
            </p>
          </div>
        `
        : '';

      return `
        <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'}">
          <div class="max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed relative group ${
            isUser
              ? 'bg-gradient-to-r from-[#D9A52D] to-[#C6A15B] text-[#16070B] font-medium rounded-br-sm shadow-md'
              : 'bg-[#231016]/95 border border-[#C6A15B]/35 text-[#F8F3E9] rounded-bl-sm shadow-lg'
          }">
            <div>${this.formatMarkdownSafe(m.content)}</div>
            ${packageCardHtml}
            ${whatsappConnectHtml}
            ${bookingDispatchHtml}
            <div class="flex items-center justify-between gap-3 mt-2 pt-1 border-t ${isUser ? 'border-[#16070B]/15 text-[#16070B]/70' : 'border-[#C6A15B]/15 text-[#DCCBB0]/65'} text-[9px]">
              <span>${m.timestamp || ''}</span>
              ${!isUser ? `
                <button
                  type="button"
                  data-copy-msg-idx="${idx}"
                  class="opacity-75 hover:opacity-100 hover:text-[#F9E29B] transition-opacity"
                  title="Copy response"
                >
                  Copy
                </button>
              ` : ''}
            </div>
          </div>
          ${quickRepliesHtml}
        </div>
      `;
    }).join('');

    // Bind Quick Replies
    container.querySelectorAll('[data-chat-quick-reply]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.currentTarget.getAttribute('data-chat-quick-reply');
        if (text === 'Start Chat Booking Assistant' || text === 'Book a Consultation') {
          this.startInteractiveBookingFlow();
        } else {
          this.handleUserInput(text);
        }
      });
    });

    // Bind Book This Package buttons -> Pre-fill website booking form
    container.querySelectorAll('[data-chat-book-pkg]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pkgId = e.currentTarget.getAttribute('data-chat-book-pkg');
        const pkg = (window.VASTU_DATA?.packages || []).find(p => p.id === pkgId);
        if (pkg && window.VastuApp && typeof window.VastuApp.navigateToWhatsAppBookingForPackage === 'function') {
          this.toggleChat(false);
          window.VastuApp.navigateToWhatsAppBookingForPackage(pkg);
        } else {
          const bookingSec = document.getElementById('booking-section');
          if (bookingSec) {
            this.toggleChat(false);
            bookingSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Bind Copy response buttons
    container.querySelectorAll('[data-copy-msg-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-copy-msg-idx'), 10);
        const msg = this.messages[idx];
        if (msg && navigator.clipboard) {
          navigator.clipboard.writeText(msg.content);
          e.currentTarget.textContent = 'Copied ✓';
          setTimeout(() => {
            if (e.currentTarget) e.currentTarget.textContent = 'Copy';
          }, 1500);
        }
      });
    });

    this.scrollToBottom();
  }

  scrollToBottom() {
    const container = document.getElementById('vastu-ai-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // Interactive 10-Field Conversational Booking Assistant inside Chat
  startInteractiveBookingFlow() {
    this.bookingMode = true;
    this.bookingStepIndex = 1;

    this.messages.push({
      id: 'msg-' + Date.now(),
      role: 'user',
      content: 'Book a Consultation',
      timestamp: this.getFormattedTime()
    });

    this.messages.push({
      id: 'msg-' + (Date.now() + 1),
      role: 'assistant',
      content: `I would be delighted to assist you with your Vastu consultation booking! Let's collect your details step by step (you can type **"cancel"** anytime to exit).\n\n**Step 1 of 10:** May I know your **Full Name**?`,
      timestamp: this.getFormattedTime()
    });

    this.saveSession();
    this.renderMessages();
  }

  async processBookingStepInput(text) {
    const lower = text.toLowerCase().trim();
    if (lower === 'cancel' || lower === 'stop' || lower === 'exit') {
      this.bookingMode = false;
      this.bookingStepIndex = 0;
      this.messages.push({
        id: 'msg-' + Date.now(),
        role: 'assistant',
        content: `No problem! We have exited the booking assistant. How else may I help you with Vastu principles or our consultation packages?`,
        timestamp: this.getFormattedTime(),
        quickReplies: this.initialQuickReplies
      });
      this.saveSession();
      this.renderMessages();
      return;
    }

    const step = this.bookingStepIndex;
    let nextPrompt = '';
    let nextQuickReplies = [];

    if (step === 1) {
      this.bookingDraft.fullName = text;
      this.bookingStepIndex = 2;
      nextPrompt = `Thank you, **${text}**! \n\n**Step 2 of 10:** Please share your **WhatsApp Number** (with country/city code if applicable).`;
    } else if (step === 2) {
      this.bookingDraft.whatsapp = text;
      this.bookingStepIndex = 3;
      nextPrompt = `**Step 3 of 10:** What is your **Email Address**?`;
    } else if (step === 3) {
      this.bookingDraft.email = text;
      this.bookingStepIndex = 4;
      nextPrompt = `**Step 4 of 10:** Which **City / Location** is your property located in?`;
    } else if (step === 4) {
      this.bookingDraft.city = text;
      this.bookingStepIndex = 5;
      nextPrompt = `**Step 5 of 10:** What is your **Property Type**? (e.g., Independent House, Apartment / Flat, Villa / Duplex, Office, Shop, Factory, or Plot)`;
      nextQuickReplies = ['Apartment / Flat', 'Independent House', 'Villa / Duplex', 'Office / Commercial', 'Factory / Industrial', 'Plot / Land'];
    } else if (step === 5) {
      this.bookingDraft.propertyType = text;
      this.bookingStepIndex = 6;
      nextPrompt = `**Step 6 of 10:** Please choose your **Consultation Category**:`;
      nextQuickReplies = ['Residential Vastu', 'Commercial Vastu', 'Industrial Vastu', 'Land & Plot Vastu'];
    } else if (step === 6) {
      this.bookingDraft.category = text;
      this.bookingStepIndex = 7;
      nextPrompt = `**Step 7 of 10:** Which **Preferred Consultation Package** would you like to select?`;
      nextQuickReplies = [
        'Basic Home Vastu (₹5,100)',
        'Complete Home Vastu Analysis (₹11,000)',
        'Premium Residential Vastu (₹21,000)',
        'Flat & Apartment Vastu (₹8,500)',
        'Office / Commercial Vastu (₹18,000)',
        'Factory / Industrial Vastu (₹28,000)'
      ];
    } else if (step === 7) {
      this.bookingDraft.packageName = text;
      this.bookingStepIndex = 8;
      nextPrompt = `**Step 8 of 10:** Do you prefer an **Online** (Video/Phone) or **Offline** (In-Person Site Visit) consultation?`;
      nextQuickReplies = ['Online Consultation (Video / Phone)', 'Offline Consultation (On-Site Visit)'];
    } else if (step === 8) {
      this.bookingDraft.mode = text;
      this.bookingStepIndex = 9;
      nextPrompt = `**Step 9 of 10:** Please share a **Brief Description of Your Requirement** (e.g., new construction blueprint review, main entrance check, or non-demolition remedies).`;
      nextQuickReplies = ['Floor Plan & Direction Review', 'Non-Demolition Remedies for Existing Space', 'New Construction Planning'];
    } else if (step === 9) {
      this.bookingDraft.requirement = text;
      this.bookingStepIndex = 10;
      nextPrompt = `**Step 10 of 10:** What is your **Preferred Date and Time** for the consultation? (e.g., Tomorrow 11:30 AM, or 10 Nov at 4:00 PM)`;
      nextQuickReplies = ['Tomorrow 11:30 AM', 'This Weekend 11:00 AM', 'Next Week 04:00 PM'];
    } else if (step === 10) {
      this.bookingDraft.preferredDateTime = text;
      this.bookingMode = false;
      this.bookingStepIndex = 0;

      const d = this.bookingDraft;
      const summaryText =
`Thank you! Please review your consultation booking summary below:

• **Full Name:** ${d.fullName}
• **WhatsApp Number:** ${d.whatsapp}
• **Email Address:** ${d.email}
• **City:** ${d.city}
• **Property Type:** ${d.propertyType}
• **Consultation Category:** ${d.category}
• **Preferred Package:** ${d.packageName}
• **Consultation Format:** ${d.mode}
• **Requirement:** ${d.requirement}
• **Preferred Date & Time:** ${d.preferredDateTime}

*Important Note:* Your enquiry has been recorded in our system, and your formatted WhatsApp booking message is ready below. Please click **SEND TO WHATSAPP** to send this directly to Vastu Sutram (${this.chatbotWhatsAppDisplay}) for final slot confirmation.`;

      const waMessage =
`*VASTU SUTRAM – AI ASSISTANT BOOKING ENQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• *Full Name:* ${d.fullName}
• *WhatsApp Number:* ${d.whatsapp}
• *Email:* ${d.email}
• *City:* ${d.city}
• *Property Type:* ${d.propertyType}
• *Category:* ${d.category}
• *Preferred Package:* ${d.packageName}
• *Consultation Mode:* ${d.mode}
• *Preferred Date & Time:* ${d.preferredDateTime}
• *Requirement:* ${d.requirement}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      const waUrl = `https://api.whatsapp.com/send?phone=${this.chatbotWhatsAppNumber}&text=${encodeURIComponent(waMessage)}`;

      // Save to backend /api/bookings securely
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: d.fullName,
            phone: d.whatsapp,
            email: d.email,
            city: d.city,
            propertyType: d.propertyType,
            serviceName: d.category,
            packageName: d.packageName,
            consultationMode: d.mode,
            appointmentDate: d.preferredDateTime,
            message: d.requirement,
            source: 'Vastu Sutram AI Assistant'
          })
        });
      } catch (err) {
        // Non-blocking
      }

      this.messages.push({
        id: 'msg-' + Date.now(),
        role: 'assistant',
        content: summaryText,
        timestamp: this.getFormattedTime(),
        whatsappBookingUrl: waUrl,
        quickReplies: ['Explore Vastu Services', 'Consultation Packages & Pricing']
      });
      this.saveSession();
      this.renderMessages();
      return;
    }

    this.messages.push({
      id: 'msg-' + Date.now(),
      role: 'assistant',
      content: nextPrompt,
      timestamp: this.getFormattedTime(),
      quickReplies: nextQuickReplies
    });
    this.saveSession();
    this.renderMessages();
  }

  async handleUserInput(text) {
    this.messages.push({
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: this.getFormattedTime()
    });
    this.saveSession();
    this.renderMessages();

    // If in step-by-step booking wizard mode, process next booking field
    if (this.bookingMode) {
      await this.processBookingStepInput(text);
      return;
    }

    // Show typing indicator
    this.setTyping(true);

    try {
      const historyPayload = this.messages
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          language: this.language
        })
      });

      const data = await res.json();
      this.setTyping(false);

      if (data.triggerBookingWizard) {
        this.bookingMode = true;
        this.bookingStepIndex = 1;
        this.messages.push({
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content: `${data.reply}\n\n**Step 1 of 10:** May I know your **Full Name**? *(Type "cancel" anytime to exit)*`,
          timestamp: this.getFormattedTime()
        });
      } else {
        this.messages.push({
          id: 'msg-' + Date.now(),
          role: 'assistant',
          content: data.reply || 'I am here to assist you with Vastu Sutram services and bookings.',
          timestamp: this.getFormattedTime(),
          quickReplies: data.suggestedQuickReplies || this.initialQuickReplies,
          recommendedPackageId: data.recommendedPackageId || null,
          showWhatsAppConnect: Boolean(data.showWhatsAppConnect)
        });
      }

      this.saveSession();
      this.renderMessages();
    } catch (err) {
      this.setTyping(false);
      this.messages.push({
        id: 'msg-' + Date.now(),
        role: 'assistant',
        content: `I apologize for the temporary connection interruption. You can connect directly with **Rajni Singh** on WhatsApp for immediate assistance.`,
        timestamp: this.getFormattedTime(),
        showWhatsAppConnect: true,
        quickReplies: this.initialQuickReplies
      });
      this.saveSession();
      this.renderMessages();
    }
  }

  setTyping(state) {
    this.isTyping = state;
    const typingEl = document.getElementById('vastu-ai-typing');
    if (!typingEl) return;
    if (state) {
      typingEl.classList.remove('hidden');
      this.scrollToBottom();
    } else {
      typingEl.classList.add('hidden');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.VastuChatbot = new VastuAIChatbot();
});

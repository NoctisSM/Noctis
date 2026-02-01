// WaffleLLM - Portfolio Assistant Chat
class WaffleLLM {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.createUI();
        this.bindEvents();
        this.addMessage('waffle', "Woof! I'm Waffle, the portfolio assistant. Ask me about the work, skills, or experience showcased here!");
    }

    createUI() {
        // Chat container
        this.container = document.createElement('div');
        this.container.className = 'waffle-chat';
        this.container.innerHTML = `
            <div class="waffle-chat-panel">
                <div class="waffle-chat-header">
                    <div class="waffle-header-info">
                        <span class="waffle-avatar">🐕</span>
                        <span class="waffle-name">WaffleLLM</span>
                    </div>
                    <button class="waffle-close" aria-label="Close chat">&times;</button>
                </div>
                <div class="waffle-chat-messages"></div>
                <div class="waffle-chat-input">
                    <input type="text" placeholder="Ask Waffle anything..." aria-label="Chat message">
                    <button aria-label="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .waffle-chat {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
            }

            .waffle-chat-panel {
                display: none;
                width: 380px;
                max-width: calc(100vw - 48px);
                height: 500px;
                max-height: calc(100vh - 100px);
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                flex-direction: column;
                overflow: hidden;
            }

            .waffle-chat.open .waffle-chat-panel {
                display: flex;
            }

            .waffle-chat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: #3B82F6;
                color: white;
            }

            .waffle-header-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .waffle-avatar {
                font-size: 24px;
            }

            .waffle-name {
                font-weight: 600;
                font-size: 16px;
            }

            .waffle-close {
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                line-height: 1;
                opacity: 0.8;
                transition: opacity 0.2s;
            }

            .waffle-close:hover {
                opacity: 1;
            }

            .waffle-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: #fafcfd;
            }

            .waffle-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.5;
            }

            .waffle-message.waffle {
                background: #3B82F6;
                color: white;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }

            .waffle-message.user {
                background: #e8e8e8;
                color: #32404f;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }

            .waffle-chat-input {
                display: flex;
                gap: 8px;
                padding: 16px;
                background: #fff;
                border-top: 1px solid rgba(50, 64, 79, 0.1);
            }

            .waffle-chat-input input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid rgba(50, 64, 79, 0.2);
                border-radius: 24px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }

            .waffle-chat-input input:focus {
                border-color: #3B82F6;
            }

            .waffle-chat-input button {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                border: none;
                background: #3B82F6;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            .waffle-chat-input button:hover {
                background: #2563eb;
            }

            .waffle-typing {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
            }

            .waffle-typing span {
                width: 8px;
                height: 8px;
                background: rgba(255,255,255,0.6);
                border-radius: 50%;
                animation: waffleTyping 1.4s infinite ease-in-out;
            }

            .waffle-typing span:nth-child(2) { animation-delay: 0.2s; }
            .waffle-typing span:nth-child(3) { animation-delay: 0.4s; }

            @keyframes waffleTyping {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-8px); }
            }

            @media (max-width: 480px) {
                .waffle-chat {
                    bottom: 16px;
                    right: 16px;
                    left: 16px;
                }

                .waffle-chat-panel {
                    width: 100%;
                    height: 60vh;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(this.container);
    }

    bindEvents() {
        // Toggle button
        const toggleBtn = document.getElementById('waffle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Close button
        const closeBtn = this.container.querySelector('.waffle-close');
        closeBtn.addEventListener('click', () => this.close());

        // Input
        const input = this.container.querySelector('input');
        const sendBtn = this.container.querySelector('.waffle-chat-input button');

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.handleUserMessage(input.value.trim());
                input.value = '';
            }
        });

        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                this.handleUserMessage(input.value.trim());
                input.value = '';
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.container.querySelector('input').focus();
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
    }

    addMessage(type, text) {
        const messagesContainer = this.container.querySelector('.waffle-chat-messages');
        const message = document.createElement('div');
        message.className = `waffle-message ${type}`;
        message.textContent = text;
        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        const messagesContainer = this.container.querySelector('.waffle-chat-messages');
        const typing = document.createElement('div');
        typing.className = 'waffle-message waffle waffle-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typing;
    }

    handleUserMessage(text) {
        this.addMessage('user', text);

        const typing = this.showTyping();

        setTimeout(() => {
            typing.remove();
            const response = this.getResponse(text.toLowerCase());
            this.addMessage('waffle', response);
        }, 800 + Math.random() * 400);
    }

    getResponse(query) {
        // Portfolio knowledge base
        const responses = {
            // About
            who: "The designer behind Noctis is a Product Designer and HCI Researcher at Georgia Tech, building systems for high-stakes environments like police dispatch, healthcare, and automotive.",
            background: "The designer started in graphic design, transitioned to UX, and is now completing an MS in Human-Computer Interaction at Georgia Tech. Previous experience includes Porsche and Align Technology.",

            // Experience
            experience: "The portfolio showcases 5+ years of experience: Interaction Design Intern at Porsche (2025), UX Designer at Align Technology (2022-2024), and UX/UI Engineer at Align (2020-2022).",
            porsche: "The Porsche project involved redesigning the vehicle configurator's design recommendations feature, reducing configuration abandonment from 64% to 22% and increasing completion rates by 116%.",
            invisalign: "At Align Technology, the Invisalign.com redesign served 12M+ users, improving task success from 67% to 94%. The work also included the patient dashboard and accessories e-commerce shop.",
            align: "At Align Technology, the Invisalign.com redesign served 12M+ users, improving task success from 67% to 94%. The work also included the patient dashboard and accessories e-commerce shop.",

            // Projects
            projects: "Featured projects include: Police Dispatch HUD (thesis), GTA Hiring Automation (85% error reduction), Porsche Configurator, and several Invisalign products.",
            thesis: "The thesis focuses on integrating aerial drone intelligence into police dispatch systems. Research included interviews with 8 officers and 3 dispatch ride-alongs to design a HUD for real-time situational awareness.",
            dispatch: "The Police Dispatch HUD project integrates live drone feeds, officer tracking, and AI-assisted queries into a unified interface for dispatchers coordinating emergency response.",
            gta: "The GTA Hiring Automation project reduced errors by 85% and saved 8-12 hours per hiring cycle through Microsoft Power Automate integration at Georgia Tech.",

            // Skills
            skills: "Core skills include: UX Research (interviews, contextual inquiry, affinity mapping), Interaction Design, Systems Design, Prototyping (Figma), and Development (JavaScript, React, HTML/CSS).",
            research: "Research specialization includes qualitative methods: semi-structured interviews, contextual inquiry, affinity mapping, journey mapping, and persona development.",

            // Interests
            interests: "Interests span: Defense Tech, Automotive (Porsche, Toyota), Design, Architecture, Economy, Leisure (photography, cooking, shooting), and Hockey.",

            // Contact
            contact: "For contact information, check the footer or About page for email and LinkedIn links.",
            email: "You can find the email address in the footer of the website.",
            linkedin: "The LinkedIn profile is linked in the footer of the site.",

            // Jobs
            hiring: "The designer is graduating in May 2026 and seeking Product Design, UI/UX Design, or UX Research roles in defense, healthcare, robotics, and automotive industries.",
            available: "Yes! Graduating in May 2026 and actively seeking full-time opportunities in Product Design, UI/UX Design, or UX Research.",

            // Fun
            waffle: "That's me! I'm Waffle, the portfolio assistant. I help visitors learn about the work here without clicking through all the pages. Woof!",
            dog: "Hi! I'm Waffle, the portfolio assistant. I've been trained on this portfolio to help answer your questions!",

            // Default
            default: "Woof! I'm not sure about that one. Try asking about the experience, projects, skills, or how to get in touch!"
        };

        // Match query to response
        if (query.includes('who') || query.includes('about') || query.includes('designer')) {
            return responses.who;
        }
        if (query.includes('background') || query.includes('education') || query.includes('georgia tech') || query.includes('school')) {
            return responses.background;
        }
        if (query.includes('experience') || query.includes('work history') || query.includes('career')) {
            return responses.experience;
        }
        if (query.includes('porsche') || query.includes('car') || query.includes('configurator')) {
            return responses.porsche;
        }
        if (query.includes('invisalign') || query.includes('align')) {
            return responses.invisalign;
        }
        if (query.includes('project') || query.includes('portfolio') || query.includes('work')) {
            return responses.projects;
        }
        if (query.includes('thesis') || query.includes('dispatch') || query.includes('police') || query.includes('drone')) {
            return responses.thesis;
        }
        if (query.includes('gta') || query.includes('hiring') || query.includes('automation')) {
            return responses.gta;
        }
        if (query.includes('skill') || query.includes('can do') || query.includes('abilities')) {
            return responses.skills;
        }
        if (query.includes('research') || query.includes('method')) {
            return responses.research;
        }
        if (query.includes('interest') || query.includes('hobby') || query.includes('like')) {
            return responses.interests;
        }
        if (query.includes('contact') || query.includes('reach') || query.includes('email') || query.includes('linkedin')) {
            return responses.contact;
        }
        if (query.includes('hire') || query.includes('job') || query.includes('available') || query.includes('looking')) {
            return responses.hiring;
        }
        if (query.includes('waffle') || query.includes('dog') || query.includes('you')) {
            return responses.waffle;
        }
        if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            return "Woof woof! Hello! How can I help you learn about the work showcased here today?";
        }
        if (query.includes('thank')) {
            return "You're welcome! Let me know if you have any other questions. Woof!";
        }

        return responses.default;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.waffleLLM = new WaffleLLM();
});

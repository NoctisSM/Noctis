'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const ChatWidget = ({ buttonText = "Waffle", apiEndpoint = "/api/chat" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! Ask me about my work, projects, or experience."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      setIsOpen(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

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
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: updated[lastIndex].content + parsed.content
                  };
                  return updated;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        className="chat-widget-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <span className="chat-widget-trigger-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span className="chat-widget-trigger-text">{buttonText}</span>
      </button>

      {isOpen && (
        <div
          className="chat-widget-overlay"
          ref={modalRef}
          onClick={handleBackdropClick}
        >
          <div className="chat-widget-modal" role="dialog" aria-modal="true" aria-labelledby="chat-title">
            <div className="chat-widget-header">
              <h2 id="chat-title" className="chat-widget-title">Waffle</h2>
              <button
                className="chat-widget-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="chat-widget-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-widget-message chat-widget-message-${message.role}`}
                >
                  <div className="chat-widget-message-content">
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="chat-widget-message chat-widget-message-assistant">
                  <div className="chat-widget-message-content">
                    <div className="chat-widget-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-widget-input-container">
              <input
                ref={inputRef}
                type="text"
                className="chat-widget-input"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <button
                className="chat-widget-send"
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-widget-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #1E3A8A;
          color: #FAFAFA;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(30, 58, 138, 0.25);
        }

        .chat-widget-trigger:hover {
          background: #1E40AF;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(30, 58, 138, 0.35);
        }

        .chat-widget-trigger-icon {
          display: flex;
          align-items: center;
        }

        .chat-widget-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .chat-widget-modal {
          background: #FAFAFA;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          max-height: 600px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease;
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chat-widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.1);
          background: #FFFFFF;
        }

        .chat-widget-title {
          margin: 0;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 18px;
          font-weight: 600;
          color: #0F172A;
        }

        .chat-widget-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #64748B;
          transition: all 0.15s ease;
        }

        .chat-widget-close:hover {
          background: rgba(15, 23, 42, 0.05);
          color: #0F172A;
        }

        .chat-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #FAFAFA;
        }

        .chat-widget-message {
          display: flex;
          max-width: 85%;
        }

        .chat-widget-message-user {
          align-self: flex-end;
        }

        .chat-widget-message-assistant {
          align-self: flex-start;
        }

        .chat-widget-message-content {
          padding: 12px 16px;
          border-radius: 16px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .chat-widget-message-user .chat-widget-message-content {
          background: #1E3A8A;
          color: #FAFAFA;
          border-bottom-right-radius: 4px;
        }

        .chat-widget-message-assistant .chat-widget-message-content {
          background: #FFFFFF;
          color: #0F172A;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .chat-widget-typing {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }

        .chat-widget-typing span {
          width: 8px;
          height: 8px;
          background: #94A3B8;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .chat-widget-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chat-widget-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        .chat-widget-input-container {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid rgba(15, 23, 42, 0.1);
          background: #FFFFFF;
        }

        .chat-widget-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid rgba(15, 23, 42, 0.15);
          border-radius: 12px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          color: #0F172A;
          background: #FAFAFA;
          transition: all 0.15s ease;
        }

        .chat-widget-input:focus {
          outline: none;
          border-color: #1E3A8A;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
        }

        .chat-widget-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .chat-widget-input::placeholder {
          color: #94A3B8;
        }

        .chat-widget-send {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: #1E3A8A;
          color: #FAFAFA;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .chat-widget-send:hover:not(:disabled) {
          background: #1E40AF;
        }

        .chat-widget-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chat-widget-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .chat-widget-modal {
            max-width: 100%;
            max-height: 90vh;
            border-radius: 16px 16px 0 0;
          }

          .chat-widget-trigger {
            padding: 10px 20px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;

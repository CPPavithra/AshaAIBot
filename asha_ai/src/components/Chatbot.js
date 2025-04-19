import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';
import { FaChevronLeft, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'welcome', text: 'I can answer all your questions.' },
    { sender: 'user', text: 'Show me what you can do' },
    {
      sender: 'bot',
      text: `Of course! I can assist you with a wide range of tasks and answer questions on various topics.\n\n- Answer questions\n- Generate text like articles or essays\n- Chat like a human assistant`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const userText = input.trim();
    if (!userText) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      const finalText = `${data.source === "Flan-T5" ? "🧠" : "🌐"} ${data.source} says:\n${data.response}`;

      setMessages(prev => [...prev, { sender: 'bot', text: finalText }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "⚠️ Error fetching response. Please try again later." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button"><FaChevronLeft /></button>
        <div className="header-title">
          <div className="logo">
            <img src="https://via.placeholder.com/18" alt="logo" />
          </div>
          <span>Smart AI Chat</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => {
          if (msg.sender === 'welcome') {
            return (
              <div className="welcome-message" key={idx}>
                <p>{msg.text}</p>
                <p>(Ask me anything!)</p>
              </div>
            );
          }

          const isUser = msg.sender === 'user';

          return (
            <div
              key={idx}
              className={`message ${isUser ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-bubble">
                {msg.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          );
        })}

        {/* Typing animation */}
        {isTyping && (
          <div className="message bot-message typing-indicator">
            <div className="message-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            id="userInput"
            placeholder="Ask me anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={handleSend}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;


import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
import { FaChevronLeft, FaPaperPlane } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'welcome', text: 'I can answer all your questions.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
 const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get('email') || localStorage.getItem('email'); // OR however you are storing user email

  
useEffect(() => {
  if (email) {
      fetch(`https://ashaaibot-backend.onrender.com/chat-history?email=${encodeURIComponent(email)}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Fetched data:', data); // Log the raw data received from API
          const rawMessages = data.messages || data; // In case it's wrapped in a different structure

          if (Array.isArray(rawMessages)) {
            const historyMessages = rawMessages.map(entry => ({
              sender: entry.is_user ? 'user' : 'bot',
              text: entry.message,
            }));
            setMessages(historyMessages); // Update state with history messages
          } else {
            console.error('Data is not in expected format:', rawMessages);
          }
        })
        .catch(err => {
          console.error('Failed to load history:', err); // Detailed error logging
        });
    }
  }, [email]);

 // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle sending the message and fetching AI response
  const handleSend = async () => {
    const userText = input.trim();
    if (!userText) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch("https://ashaaibot-backend.onrender.com/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, email }),
      });

      const data = await res.json();
      if (!data.response) {
        throw new Error('No response from AI');
      }

      // Add AI response to message list
      const finalText = `${data.source === "Flan-T5" ? "🧠" : "🌐"} ${data.source} says:\n${data.response}`;
      setMessages(prev => [...prev, { sender: 'bot', text: finalText }]);
    } catch (err) {
      console.error('Error fetching response:', err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "⚠️ Error fetching response. Please try again later." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle pressing the Enter key to send the message
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
              key={idx} // Could use a unique ID if available
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

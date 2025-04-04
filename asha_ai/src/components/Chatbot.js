import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';
import { FaChevronLeft, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'welcome', text: 'I can answer all your questions.' },
    { sender: 'user', text: 'Show me what you can do' },
    {
      sender: 'bot',
      text: `
        <p>Of course! I can assist you with a wide range of tasks and answer questions on various topics. Here are some things I can do:</p>
        <ul>
          <li>Answer questions: Just ask me anything you like!</li>
          <li>Generate text: I can write essays, articles, reports, stories, poems and more.</li>
          <li>Conversation AI: I can engage in conversations with you in a natural and responsive manner.</li>
        </ul>
      `
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const userText = input.trim();
    if (!userText) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      handleBotResponse(userText);
    }, 500);
  };

  const handleBotResponse = (userText) => {
    const msg = userText.toLowerCase();
    let botMessage;

    if (
      msg.includes('what you can do') ||
      msg.includes('help') ||
      msg === 'hi' ||
      msg === 'hello'
    ) {
      botMessage = `
        <p>Of course! I can assist you with a wide range of tasks and answer questions on various topics. Here are some things I can do:</p>
        <ul>
          <li>Answer questions: Just ask me anything you like!</li>
          <li>Generate text: I can write essays, articles, reports, stories, poems and more.</li>
          <li>Conversation AI: I can engage in conversations with you in a natural and responsive manner.</li>
        </ul>
      `;
    } else {
      botMessage = "<p>I'm your AI assistant. How can I help you today?</p>";
    }

    setMessages(prev => [...prev, { sender: 'bot', text: botMessage }]);
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
          const isBot = msg.sender === 'bot';

          return (
            <div
              key={idx}
              className={`message ${isUser ? 'user-message' : 'bot-message'}`}
            >
              <div
                className="message-bubble"
                {...(isBot
                  ? { dangerouslySetInnerHTML: { __html: msg.text } }
                  : { children: msg.text })}
              />
            </div>
          );
        })}
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


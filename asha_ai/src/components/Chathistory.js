// ChatHistory.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHistory = ({ userId }) => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://ashaaibot-backend.onrender.com/history/${userId}`)
      .then(res => res.json())
      .then(data => setChats(data))
      .catch(err => console.error('Failed to load history:', err));
  }, [userId]);

  const handleResume = (chatId) => {
    navigate(`/chat/${chatId}`); // goes to chatbot with previous messages
  };

  return (
    <div className="history-container">
      <h2>Chat History</h2>
      <table>
        <thead>
          <tr>
            <th>Chat ID</th>
            <th>Created At</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {chats.map(chat => (
            <tr key={chat._id}>
              <td>{chat._id}</td>
              <td>{new Date(chat.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleResume(chat._id)}>Resume</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChatHistory;


// NewChat.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewChat = ({ userId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const startNewChat = async () => {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();
      navigate(`/chat/${data._id}`);
    };

    startNewChat();
  }, [userId, navigate]);

  return <div>Creating new chat session...</div>;
};

export default NewChat;


import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import './livechat.css';

const LiveChat = ({ socket, category, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      // Emit a 'sendMessage' event to the server with the message and category
      socket.emit('sendMessage', { text: newMessage, user: user.username, category, userId: user._id });
      setNewMessage('');
    }
  };

  const divRef = useRef();

  useEffect(() => {
    // Join the category room when the component mounts
    socket.emit('joinCategory', category);
  
    // Fetch initial message history when component mounts
    socket.emit('requestMessageHistory', category, (messageHistory) => {
      setMessages(messageHistory);
      // Scroll to the bottom of the chat when messages change
      divRef.current.scrollTop = divRef.current.scrollHeight;
    });
  
    // Listen for incoming messages and update the state
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => {
        const isSender = message.userId === user._id;
        const duplicateMessage = isSender && prevMessages.some((prevMessage) => prevMessage.text === message.text);
        return duplicateMessage ? prevMessages : [...prevMessages, message];
      });
  
      // Scroll to the bottom of the chat when messages change
      divRef.current.scrollTop = divRef.current.scrollHeight;
    });
  
    // Cleanup socket event listeners when the component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, category, user]);
  
  return (
    <div className="chat-container">
      <div className="chat-messages" ref={divRef}>
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className="username" style={{ color: message.userId === user._id ? 'blue' : 'black' }}>
              {message.user}
            </div>
            <div className="text">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ fontFamily: 'Roboto' }}
          />
          <button onClick={sendMessage} style={{ backgroundColor: 'blue', color: 'white' }}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Trash2, User } from 'lucide-react';
import './App.css';

function SimpleChatApp() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "ສະບາຍດີ! ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ແຊັດ",
      sender: "system",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('ທ່ານ');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: username,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate a response after 1 second
    setTimeout(() => {
      const responses = [
        "ໂອເຄ ຂ້ອຍເຂົ້າໃຈແລ້ວ!",
        "ມີຫຍັງໃຫ້ຊ່ວຍບໍ່?",
        "ສົນທະນາທີ່ໜ້າສົນໃຈ!",
        "ຂໍໂທດ, ຂ້ອຍຍັງຮຽນຮູ້ຢູ່",
        "ດີຫຼາຍ!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage = {
        id: Date.now(),
        text: randomResponse,
        sender: "ChatBot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "ແຊັດໄດ້ຖືກລຶບແລ້ວ - ເລີ່ມການສົນທະນາໃໝ່!",
      sender: "system",
      timestamp: new Date()
    }]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('lo-LA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="title-section">
            <div className="icon-container">
              <MessageCircle className="header-icon" />
            </div>
            <div>
              <h1 className="app-title">Simple Chat</h1>
              <p className="app-subtitle">ແອັບແຊັດງ່າຍໆ</p>
            </div>
          </div>
          
          <div className="controls">
            <input
              type="text"
              placeholder="ຊື່ຂອງທ່ານ"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
            />
            <button
              onClick={clearChat}
              className="clear-button"
              title="ລຶບແຊັດ"
            >
              <Trash2 className="clear-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.sender === username ? 'user-message' : 'other-message'}`}
          >
            <div
              className={`message-bubble ${
                message.sender === username
                  ? 'user-bubble'
                  : message.sender === 'system'
                  ? 'system-bubble'
                  : 'bot-bubble'
              }`}
            >
              {message.sender !== username && message.sender !== 'system' && (
                <div className="sender-info">
                  <User className="sender-icon" />
                  <span className="sender-name">{message.sender}</span>
                </div>
              )}
              
              <p className="message-text">{message.text}</p>
              
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ພິມຂໍ້ຄວາມຂອງທ່ານທີ່ນີ້..."
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={inputMessage.trim() === ''}
            className={`send-button ${inputMessage.trim() === '' ? 'disabled' : 'active'}`}
          >
            <Send className="send-icon" />
          </button>
        </div>
        
        <div className="input-hint">
          <p>ກົດ Enter ເພື່ອສົ່ງຂໍ້ຄວາມ</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleChatApp;
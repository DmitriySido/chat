'use client';

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

import LoginForm from './components/loginForm/LoginForm';
import InputMessage from './components/UI/inputMessage/InputMessage';
import SendButton from './components/UI/sendButton/SendButton';

const Chat = () => {
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null); 
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Создание нового веб-сокета \\
      const newSocket = io('http://localhost:3001', {
        auth: {
          token: Cookies.get('token'),
        }
      });

      newSocket.emit('set username', username); // Отправка имени пользователя

      newSocket.on('chat message', (message) => setMessages((prevMessages) => [...prevMessages, message])); // Обработка входящих сообщений

      setSocket(newSocket); // Обновление состояния WebSocket-соединения

      return () => {
        newSocket.off('chat message');
        newSocket.close();
      };
    }
  }, [isAuthenticated]);

  // Прокрутка к новому сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка сообщений
  const sendMessage = () => {
    if (socket) { // Проверка на подключение сокета
      if (newMessage !== '') {
        socket.emit('chat message', newMessage); // Отправка сообщения
        setNewMessage('');
        messageInputRef.current?.focus();
      }
    }
  };
  
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', { username });
      Cookies.set('token', response.data.token); // Сохранение токена в куки
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Не удалось авторизоваться!', error);
    }
  };

  return (
    <>
    {!isAuthenticated ? <LoginForm login={login} setUsername={setUsername}/> :
    <div className="chat-container">
      <h1>Новый чат</h1>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user === username ? 'sent' : 'received'}`}>
            <strong>{message.user}:</strong> {message.message}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Элемент для автоматической прокрутки */}
      </div>
        <div className='send-field__wrapper'>
          <InputMessage sendMessage={sendMessage} messageInputRef={messageInputRef} setNewMessage={setNewMessage} newMessage={newMessage}/>

          <SendButton sendMessage={sendMessage}/>
        </div>
      </div>
      }
    </>
  );
};

export default Chat;
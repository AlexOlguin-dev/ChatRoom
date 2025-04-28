import React, { useState, useEffect } from 'react';
import { db, ref, set, onValue } from './firebase';

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');

  // Obtiene los mensajes de la base de datos en tiempo real
  useEffect(() => {
    const messagesRef = ref(db, 'messages/');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesList = [];
      for (let id in data) {
        messagesList.push({ id, ...data[id] });
      }
      setMessages(messagesList);
    });
  }, []);

  // Función para enviar un mensaje
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messagesRef = ref(db, 'messages/' + Date.now());
      set(messagesRef, {
        username,
        message: newMessage,
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Chatroom</h1>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.username}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Escribe un mensaje"
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chatroom;
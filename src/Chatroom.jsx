import React, { useState, useEffect } from 'react';
import { db, ref, set, onValue, remove, onDisconnect } from './firebase';
import { AppBar, Toolbar, Typography, IconButton, Box, Modal, TextField, InputAdornment, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import Ninja from './assets/img/icon.png';

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [modalOpen, setModalOpen] = useState(true);
  const [tempUsername, setTempUsername] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('chat_username');
    if (storedUsername) {
      setUsername(storedUsername);
      setModalOpen(false);
    }
  }, []);

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

  useEffect(() => {
    if (username) {
      const userRef = ref(db, `connectedUsers/${username}`);
      set(userRef, true);

      // Eliminar usuario al desconectarse
      onDisconnect(userRef).remove();

      // Escuchar usuarios conectados
      const connectedUsersRef = ref(db, 'connectedUsers/');
      onValue(connectedUsersRef, (snapshot) => {
        const usersData = snapshot.val() || {};
        const usersList = Object.keys(usersData);
        setConnectedUsers(usersList);
      });
    }
  }, [username]);

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

  const handleUsernameSubmit = () => {
    if (tempUsername.trim() !== '') {
      localStorage.setItem('chat_username', tempUsername);
      setUsername(tempUsername);
      setModalOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ backgroundColor: '#e8f5e9', minHeight: '100vh' }}>
      <div style={{ filter: modalOpen ? 'blur(8px)' : 'none', transition: 'filter 0.3s ease', minHeight: '100vh', position: 'relative', paddingBottom: '80px' }}>
        {/* Navbar principal */}
        <AppBar position="static" sx={{ backgroundColor: '#7CB89C' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="icon" sx={{ ml: 1 }}>
              <img src={Ninja} alt="Chatroom Icon" style={{ width: 30, height: 30, marginRight: 8 }} />
            </IconButton>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              Chatroom Test
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Barra gris debajo del AppBar */}
        {!modalOpen && (
          <Box
            sx={{
              backgroundColor: '#f0f0f0',
              padding: '8px 16px',
              borderBottom: '1px solid #ccc' }}>
            <Typography variant="subtitle1" color="textSecondary">
              Usuario: {username}
            </Typography>
          </Box>
        )}

        {/* Mensajes */}
        <Box p={2} sx={{ paddingBottom: '100px' }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{ backgroundColor: '#d0ebd0', padding: 2, marginBottom: 2, borderRadius: 2, boxShadow: 3 }}
            >
              <Typography variant="subtitle2" fontWeight="bold" fontSize={15} gutterBottom>
                {msg.username}
              </Typography>
              <Typography variant="body1" fontSize={20}>
                {msg.message}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Input de nuevo mensaje fijo abajo */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            borderTop: '1px solid #ccc',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            placeholder="Escribe un mensaje"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={sendMessage} color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Modal de bienvenida */}
        <Modal open={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 350,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" component="h2" mb={1}>
              Bienvenido al chat público
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Escribe tu nombre para chatear
            </Typography>
            <TextField
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              label="Nombre de usuario"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleUsernameSubmit}
              fullWidth
              sx={{
                backgroundColor: '#7CB89C',
                '&:hover': { backgroundColor: '#68A78B' },
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Modal>

        {/* Drawer lateral de usuarios conectados */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box
            sx={{
              width: 250,
              backgroundColor: '#5C9C7C',
              height: '100%',
              color: 'white',
            }}
          >
            <Typography variant="h6" sx={{ p: 2 }}>
              Usuarios conectados
            </Typography>
            <List>
              {connectedUsers.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </div>
    </Box>
  );
};

export default Chatroom;
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const SECRET_KEY = 'SecretKey';

// Маршрут для логина
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).send('Username is required');
  }
});

// Middleware для проверки JWT токена
const authenticateToken = (socket, next) => {
  const token = socket.handshake.auth.token; // Получение токена
  if (!token) return next(new Error('Authentication error'));

  jwt.verify(token, SECRET_KEY, (err, user) => { // Проверка токена
    if (err) return next(new Error('Authentication error'));
    socket.user = user;
    next();
  });
};

io.use(authenticateToken);

io.on('connection', (socket) => {
  console.log('Пользователь подключился!');

  socket.on('set username', (username) => {
    socket.username = username;
    io.emit('chat message', { user: 'System', message: `${username} присоединился к чату` });
  });

  socket.on('chat message', (message) => socket.username && io.emit('chat message', { user: socket.username, message }));

  socket.on('disconnect', () => socket.username && io.emit('chat message', { user: 'System', message: `${socket.username} покинул чат` }));
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});

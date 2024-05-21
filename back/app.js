const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const userRouter = require('./routes/UserRouter');
const BookRouter = require('./routes/BookRouter');
const upload = require('./utility/multerConfig');
const path = require('path');
const ChatMessage = require('./models/ChatMessage'); // Import the ChatMessage model
const socketIO = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname,"uploads")));

// Connect to MongoDB
mongoose.connect('mongodb+srv://BiblioTalks:64GL9SM0M5TCAKe0@cluster0.rtmbajz.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true  } );

// Check for successful MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Inside your server-side code (app.js or server.js)

const userSockets = {}; // Map to store user IDs and their corresponding sockets

// Socket.IO server logic
io.on('connection', (socket) => {

  // Handle user login event
  socket.on('login', (userId) => {
    userSockets[userId] = socket;
  });

  // Handle joinCategory event
  socket.on('joinCategory', (data) => {
    const { userId, category } = data;
    socket.join(category);
  });

  // Handle sendMessage event
  // Handle sendMessage event
  socket.on('sendMessage', async (message) => {
  // Save the message to MongoDB
  try {
    const newMessage = new ChatMessage({
      user: message.user,
      text: message.text,
      category: message.category,
    });
    await newMessage.save();
  } catch (error) {
    console.error('Error saving message to the database:', error);
  }

  // Here, we're using the user ID to send the message to the correct socket
  const userSocket = userSockets[message.userId];
  if (userSocket) {
    userSocket.emit('receiveMessage', message);
  }

  // Broadcast the message to all users in the category room
  io.to(message.category).emit('receiveMessage', message);
});


  // Handle disconnect event
  socket.on('disconnect', () => {
    // Remove the socket association when a user disconnects
    const userIdToRemove = Object.keys(userSockets).find(
      (key) => userSockets[key] === socket
    );
    if (userIdToRemove) {
      delete userSockets[userIdToRemove];
    }
  });

  // Handle requestMessageHistory event
  // Handle requestMessageHistory event
  socket.on('requestMessageHistory', async (category, callback) => {
    try {
      const messages = await ChatMessage.find({ category })
        .sort({ timestamp: 'asc' })
        .limit(10)
        .exec();
      callback(messages);
    } catch (error) {
      console.error('Error fetching message history:', error);
      callback([]);
    }
  });
});


// Routes
app.use(cors()); // Enable CORS for all routes
app.use('/users', userRouter);
app.use('/books', BookRouter);

const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

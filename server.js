require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const MONGO_URI="mongodb+srv://paramanilkumar:a9midU1t4g5azZ5H@cluster0.zlsyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('views'));
app.use('/api/auth', authRoutes);

const users = {};

io.on('connection', socket => {
    console.log('User Connected:', socket.id);

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        users[socket.id] = { username, room };
        socket.to(room).emit('message', { from_user: 'System', message: `${username} joined the room` });
    });

    socket.on('chatMessage', async ({ from_user, room, message }) => {
        const newMessage = new Message({ from_user, room, message });
        await newMessage.save();
        io.to(room).emit('message', { from_user, message });
    });

    socket.on('typing', ({ username, room }) => {
        socket.to(room).emit('typing', username);
    });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit('message', { from_user: 'System', message: `${user.username} left the room` });
            delete users[socket.id];
        }
        console.log('User Disconnected:', socket.id);
    });
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

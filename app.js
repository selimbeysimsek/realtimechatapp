// Pakete importieren
const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');

// Express-Server erstellen
const app = express();
const server = require('http').createServer(app);
const io = socketio(server);

// Middleware definieren
app.use(express.static('public'));

//MongoDB konfigurieren
mongoose.connect('mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Chat-Nachrichten-Modell erstellen
const MessageSchema = new mongoose.Schema({message: String, sender: String, receiver: String, timestamp: Date});
const Message = mongoose.model('Message', MessageSchema);

// Chat-User-Modell erstellen
const UserSchema = new mongoose.Schema({username: String, password: String});
const User = mongoose.model('User', UserSchema);

// Test Message für die Datenbank
const newMessage = new Message({message: 'Test', sender: 'TestSender', receiver: 'TestReceiver', timestamp: Date.now()});

// Test User für die Datenbank
const newUser = new User({username:'selim', password:'1234'});

// newMessage.save()
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// newUser.save()
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Socket.io-Verbindung herstellen
io.on('connection', (socket) => {
    console.log('User connected');

    // Nachrichten empfangen 
    socket.on('message', (data) => {
        console.log(data);
        const newMessage = new Message({message: data.text, sender: data.sender, receiver: data.receiver, timestamp: data.time});
        newMessage.save()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
        io.emit('message', data);
    });

    // Verbindung trennen
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Routings definieren
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
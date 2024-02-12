// Pakete importieren
const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const bcrypt = require('bcryptjs');

// OWN-Variables
var username = '';

// Express-Server erstellen
const app = express();
const server = require('http').createServer(app);
const io = socketio(server);

//MongoDB konfigurieren
mongoose.connect('mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Chat-Nachrichten-Modell erstellen
const MessageSchema = new mongoose.Schema({message: String, sender: String, receiver: String, timestamp: Date});
const Message = mongoose.model('Message', MessageSchema);

// Chat-User-Modell erstellen
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}
});
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
        const newMessage = new Message({message: data.text, sender: username, receiver: data.receiver, timestamp: data.time});
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

// Middleware definieren
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Routings definieren
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chatarea', (req, res) => {
    console.log(username)
    res.sendFile(__dirname + '/chatArea.html');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

app.post('/register', async (req, res) => {
    try {
        const {new_username, new_password, confirm_password} = req.body;
        if (new_password !== confirm_password) {
            return res.status(400).send('Passwords do not match');
        }

        const existingUser = await User.findOne({username: new_username});
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        const newUser = new User({username: new_username, password: hashedPassword});
        username = new_username;
        await newUser.save();
        res.redirect('/chatarea');
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});
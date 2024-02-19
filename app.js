// Pakete importieren
const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');
// const bcrypt = require('bcryptjs');

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

// Chat-Modell erstellen
const ChatSchema = new mongoose.Schema({
    user1: {type: String, required: true},
    user2: {type: String, required: true},
    messages: [MessageSchema]
});
const Chat = mongoose.model('Chat', ChatSchema);

// Group-Chat-Modell erstellen
const GroupChatSchema = new mongoose.Schema({
    name: {type: String, required: true},
    users: [String],
    messages: [MessageSchema]
});
const GroupChat = mongoose.model('GroupChat', GroupChatSchema);

// Freundschafsanfrage-Modell erstellen
const RequestSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    receiver: {type: String, required: true}
});
const Request = mongoose.model('Request', RequestSchema);

// Freundschafts-Modell erstellen
const FriendshipSchema = new mongoose.Schema({
    user1: {type: String, required: true},
    user2: {type: String, required: true}
});
const Friendship = mongoose.model('Friendship', FriendshipSchema);

// Socket.io-Verbindung herstellen
io.on('connection', (socket) => {
    console.log('User connected');


    // Nachrichten empfangen 
    socket.on('message', (data) => {
        // Zugriff auf die Cookies über den Handshake-Mechanismus
        let cookies = socket.handshake.headers.cookie;
        // Username aus den Cookies extrahieren
        const cookie = require('cookie');
        const parsedCookies = cookie.parse(cookies);
        const usernameGlobalC = parsedCookies.username;
        const newMessage = new Message({message: data.text, sender: usernameGlobalC, receiver: data.receiver, timestamp: data.time});
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
app.use(express.json());
app.use(cookieParser());

// Routings definieren
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chatarea', (req, res) => {
    console.log(req.cookies.username)
    res.sendFile(__dirname + '/chatArea.html');
});

app.get('/anfragen', (req, res) => {
    console.log(req.cookies.username)
    res.sendFile(__dirname + '/anfragen.html');
});

app.get('/getrequests', async (req, res) => {
    try {
        let requests = '';
        let requestsarray = [];
        requests = await Request.find({receiver: req.cookies.username});
        console.log(requests);
        requests.forEach(request => {
            requestsarray.push(`${request.sender} <button class="accept" data-sender="${request.sender}" href="#">Annehmen</button>
            <button class="decline" data-sender="${request.sender}" href="#">Ablehnen</button>`);
        });
        console.log(requestsarray);
        res.json(requestsarray);
    } catch (error) {
        res.status(500).send('Fehler bei der Suche nach Anfragen');
    }
});

app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).send('Suchbegriff ist erforderlich');
    }

    try {
        let users = '';
        let usersarray = [];
        users = await User.find({
        username: { $regex: searchTerm, $options: 'i' },
        });
        console.log(users);
        console.log('=====================')
        users.forEach(user => {
            usersarray.push(`${user.username} <button class="addButton" data-username="${user.username}" href="#"><svg width="15" height="15" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Hintergrund -->
            <rect width="100%" height="100%" fill="none" />
          
            <!-- Plus-Zeichen -->
            <line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="20" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="20" />
          </svg></button>`);
        });
        console.log(usersarray);
        res.json(usersarray);
    } catch (error) {
        res.status(500).send('Fehler bei der Suche nach Benutzern');
    }
});

app.get('/add', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const newRequest = new Request({sender: req.cookies.username, receiver: username});
        await newRequest.save();
        res.json('Anfrage gesendet');
    } catch (error) {
        res.status(500).send('Fehler beim Senden der Anfrage');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Suche den Benutzer in der DB
    const existingUser = await User.findOne({username: username});
    if (!existingUser) {
        return res.status(400).send('User not found');
    } else if (existingUser.password !== password) {
        return res.status(400).send('Wrong password');
    } else {
        res.cookie('username', username, {maxAge: 900000, httpOnly: true})
        res.redirect('/chatarea');
    }
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

        // const hashedPassword = await bcrypt.hash(new_password, 10);
        const newUser = new User({username: new_username, password: new_password});
        res.cookie('username', new_username, {maxAge: 900000, httpOnly: true})
        await newUser.save();
        res.redirect('/chatarea');
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('../client/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

var players = {};

io.on('connection', (socket) => {

    players[socket.id] = {
        username: Math.floor(Math.random() * 100),
        position: { x: 10, y: 10 },
        id: socket.id,
    };

    logSockets();

    socket.on('disconnect', () => {
        delete players[socket.id];

        logSockets();

        io.emit('disconnection', players);
    });
});

http.listen(3000, () => {
    logSockets();
});

logSockets = () => {
    console.clear();
    process.stdout.write("┌────────────────────────────┐\n");
    console.log('│    \x1b[32mlistening on *:3000\x1b[0m     │');
    process.stdout.write("╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n");
    console.log('      Connected players :');
    process.stdout.write("╔════════════════════════════╗\n");
    if (Object.keys(players).length == 0) {
        process.stdout.write("║     No player connected    ║\n");
    } else {
        Object.keys(players).forEach(function (id) {
            process.stdout.write('║    \x1b[36m' + players[id].username + '\x1b[0m:   ');
            for (var i = players[id].username.toString().length; i < 20; i++) {
                process.stdout.write(" ");
            }
            process.stdout.write("║\n");
            process.stdout.write('║    \x1b[33m' + players[id].id + '\x1b[0m    ║\n');
        });
    }
    process.stdout.write("╚════════════════════════════╝");
}
var app = require('express')();
let cors = require('cors');

app.use(cors())

// https://nodejs.org/docs/latest/api/child_process.html
const { spawn } = require('child_process');

const PORT = 3005;
const HOST = "0.0.0.0";

const server = require('http').createServer();

const edgeServers = [
    "207.148.90.31",
    "149.28.113.154",
    "45.32.201.66",
    "144.202.92.152",
    "45.77.120.59",
    "45.32.217.220",
    "95.179.149.124",
    "108.61.197.203",
    "140.82.51.44",
    "108.61.123.240",
    "45.77.197.253",
    "45.76.176.198",
    "45.77.143.47",
    "102.130.49.133",
    "149.248.61.157",
    "173.208.191.106",
    "185.246.152.62",
    "213.183.63.254",
    "185.246.154.105",
    "185.121.168.13",
    "45.64.105.110",
    "108.61.87.100",
    "208.100.34.162",
    "213.226.68.79",
    "149.28.189.225",
    "170.81.43.202",
    "104.192.3.250",
    "185.157.235.82",
    "131.221.32.78",
    "69.51.11.18",
    "103.205.143.247",
    "160.20.146.189"
]

const io = require('socket.io')(server, {
    path: '/test',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

preloadLocation = (domain, edgeIP) => {
    domain = new URL(domain);
    return spawn('curl', ['-Lsi',
        `${domain.href}`,
        '--resolve', `${domain.host}:443:${edgeIP}`]);
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('preloadDomain', (domain) => {
        console.log(domain)

        edgeServers.forEach(edgeIP => {
            // Preload in each edge server and notify the client side
            preloadLocation(domain, edgeIP).stdout.on('data', (data) => {
                data = data.toString()
                if (data !== null) {
                    socket.emit('preloadedData', data)
                }
            });
        })
    })
});

server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

//let infolist = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


parser.on('data', (data) => {
    console.log('Arduino:', data);
    largestVal = data
    if (largestVal >= 0 && largestVal < 200) {
        io.emit('serialData', 'p')
    } else if (largestVal >= 200 && largestVal < 315) {
        io.emit('serialData', 'mp')
    } else if (largestVal >= 315 && largestVal < 415) {
        io.emit('serialData', 'mf')
    } else if (largestVal >= 415 && largestVal < 800) {
        io.emit('serialData', 'f')
    } else if (largestVal >= 800) {
        io.emit('serialData', "ff")
    }
    //io.emit('serialData', infolist);
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
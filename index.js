const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const noOfLocations = 12;

http.listen(3000, () => console.log('Listening on *:3000'));

app.use(express.static(path.join(__dirname, 'public')));

var usersList = [];
var currentSpy;

io.on('connection', (socket) => {
  var addedUser = false;

  socket.on('add user', (name) => {
    if (addedUser === true) return;

    socket.name = name;
    addedUser = true;
    usersList.push(name);

    console.log(name + ' joined');
    socket.emit('user joined', {
      users: usersList
    });
    socket.broadcast.emit('user joined', {
      users: usersList
    });
  });

  socket.on('all in', () => {
    const spyIndex = generateRandomNumber(0, usersList.length);
    const locationIndex = generateRandomNumber(0, noOfLocations);

    currentSpy = usersList[spyIndex]

    console.log('Spy: ' + usersList[spyIndex]);
    io.sockets.emit('game start', {
      spy: currentSpy,
      location: locationIndex
    });
  })

  socket.on('game over', () => {
    io.sockets.emit('reveal spy', {
      spy: currentSpy
    });

    const spyIndex = generateRandomNumber(0, usersList.length);
    const locationIndex = generateRandomNumber(0, noOfLocations);

    currentSpy = usersList[spyIndex]

    console.log('Spy: ' + usersList[spyIndex]);
    io.sockets.emit('game start', {
      spy: currentSpy,
      location: locationIndex
    });
  })
});

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};


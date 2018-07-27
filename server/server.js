const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
// console.log(__dirname + '/../public');
// console.log(publicPath)
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

//============== io.on Lets you register an event listner ======================//
io.on('connection', (socket)=>{
  console.log('New User Connected');
// socket.emit emits to a single connection
socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

  // socket.emit('newMessage', {
  //   from : "Hassan",
  //   text : "Hey, What's going on",
  //   createdAt:new Date().getTime()
  //
  // });

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

  // socket.broadcast.emit('newMessage', {
  //   from:'Admin',
  //   text:'New User Joined',
  //   createdAt:new Date().getTime()
  // });


  socket.on('createMessage', (message, callback)=>{
    console.log('Create Message', message);
    //====================== io.emit emits to every single connected connection =========================//
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback(); // You can send an object as well
    // io.emit('newMessage', {
    //   from:message.from,
    //   to:message.text,
    //   createdAt:new Date().getTime()
    // });

    // socket.broadcast.emit('newMessage', {
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    //});
  });

  socket.on('createLocationMessage', (coords)=>{
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', ()=>{
    console.log('User was disconnected');
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});

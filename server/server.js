const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
// console.log(__dirname + '/../public');
// console.log(publicPath)
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

// io.on Lets you register an event listner

io.on('connection', (socket)=>{
  console.log('New User Connected');
// socket.emit emits to a single connection
  // socket.emit('newMessage', {
  //   from : "Hassan",
  //   text : "Hey, What's going on",
  //   createAt : 123
  // });

  socket.on('createMessage', (message)=>{
    console.log('Create Message', message);
    //io.emit emits to every single connected connection
    io.emit('newMessage', { 
      from:message.from,
      to:message.text,
      createdAt:new Date().getTime()
    });
  });

  socket.on('disconnect', ()=>{
    console.log('User was disconnected');
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});

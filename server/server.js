const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');
var {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
// console.log(__dirname + '/../public');
// console.log(publicPath)
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

//============== io.on Lets you register an event listner ======================//
io.on('connection', (socket)=>{
  console.log('New User Connected');
// socket.emit emits to a single connection

//socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

  // socket.emit('newMessage', {
  //   from : "Hassan",
  //   text : "Hey, What's going on",
  //   createdAt:new Date().getTime()
  //
  // });

  //socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

  socket.on('join', (params, callback) =>{
    if(!isRealString(params.name) || !isRealString(params.room) ){
      return callback('Name and Room name are required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    //socket.room('the office fans');

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });
  // socket.broadcast.emit('newMessage', {
  //   from:'Admin',
  //   text:'New User Joined',
  //   createdAt:new Date().getTime()
  // });


  socket.on('createMessage', (message, callback)=>{
    // console.log('Create Message', message);
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    //====================== io.emit emits to every single connected connection =========================//
    // io.emit('newMessage', generateMessage(message.from, message.text));
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
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  socket.on('disconnect', ()=>{
    var user = users.removeUser(socket.id);
    // console.log('my user',user);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));

    }
    //console.log('User was disconnected');
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});


var socket = io(); // This initiates the request, important to send data to the server and get data from the server
socket.on('connect',function (){
  console.log('Connected to server');

  socket.emit('createMessage',{
    from: 'junaid',
    text: 'Hey this is junaid'
  });
});

socket.on('disconnect',function (){
  console.log('DisConnected');
});

socket.on('newMessage', function(message){
  console.log('New Message', message);
});

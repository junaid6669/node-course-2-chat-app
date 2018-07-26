
var socket = io(); // This initiates the request, important to send data to the server and get data from the server
socket.on('connect',function (){
  console.log('Connected to server');

  // socket.emit('createMessage',{
  //   from: 'junaid',
  //   text: 'Hey this is junaid'
  // });
});

socket.on('disconnect',function (){
  console.log('DisConnected');
});

socket.on('newMessage', function(message){
  console.log('New Message', message);

  var li = jQuery('<li></li>');
  li.text(`${message.from} : ${message.text}`);
  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'Maaz',
//   text: 'hi'
// }, function (data) {
//   console.log('Got It', data);
// });

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function(){

  });
});


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
  //console.log('New Message', message);
  var formattedTime = moment(message.createdAt).format('h:mm s');
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm s');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location </a>');
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
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
  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function(){
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location....');
  navigator.geolocation.getCurrentPosition(function (position){
    locationButton.removeAttr('disabled').text('Send Location');
    // console.log(position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function (){
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  });
});

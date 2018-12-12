var socket = io();

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  console.log("New message received", message);

  var li = `<li>${message.from}: ${message.text}</li>`;
  $('#messagesList').append(li);
});

socket.on("newLocationMessage", function(message) {
  console.log("New location message received", message);

  var a = $('<a target="_blank"></a>');
  a.text('Show my location');
  a.attr('href', message.url);
  
  var li = $('<li></li>');
  li.text(`${message.from}: `);
  li.append(a);
  $('#messagesList').append(li);
});

$('#messageForm').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $(this).find("input[name='message']").val()
  }, function(res) {
    console.log('Response is', res);
  });
});

var sendLocationButton = $('#sendLocationButton');

sendLocationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    alert('Browser does not support geolocation');
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    },function(res) {
      console.log('Response is', res);
    });
  }, function(error) {
    alert('Unable to get current location');
  });
});

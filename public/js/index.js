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

$('#messageForm').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $(this).find("input[name='message']").val()
  }, function(res) {
    console.log('Response is', res);
  });
});
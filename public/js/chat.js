var socket = io();

function scrollToBottom() {
  var messagesList = $('#messagesList');
  var newMessage = messagesList.children('li:last-child');
  var scrollHeight = messagesList.prop('scrollHeight');
  var scrollTop = messagesList.prop('scrollTop');
  var clientHeight = messagesList.prop('clientHeight');
  var newMessageBuffer = newMessage.innerHeight() * 2;

  if( scrollTop + clientHeight + newMessageBuffer >= scrollHeight ) {
    messagesList.scrollTop(scrollHeight);
  }
};

socket.on("connect", function() {
  console.log("Connected to server");

  var params = $.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    }
    else {
      console.log('Everything okay!');
    }
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("updateUserList", function(users) {
  var ol = $('<ol></ol>');
  users.forEach(function(user) {
    ol.append($('<li></li>').text(user));
  });
  $('#users').html(ol);
});

socket.on("newMessage", function(message) {
  console.log("New message received", message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#messageTemplate').html();
  var li = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  })
  $('#messagesList').append(li);
  scrollToBottom();
});

socket.on("newLocationMessage", function(message) {
  console.log("New location message received", message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#locationMessageTemplate').html();
  var li = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })
  $('#messagesList').append(li);
  scrollToBottom();
});

$('#messageForm').on('submit', function(e) {
  e.preventDefault();
  var messageTextfield = $(this).find("input[name='message']");
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextfield.val()
  }, function(res) {
    console.log('Response is', res);
    messageTextfield.val('');
  });
});

var sendLocationButton = $('#sendLocationButton');

sendLocationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    alert('Browser does not support geolocation');
  }

  sendLocationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    },function(res) {
      console.log('Response is', res);
      sendLocationButton.removeAttr('disabled').text('Send Location');
    });
  }, function(error) {
    alert('Unable to get current location');
    sendLocationButton.removeAttr('disabled').text('Send Location');
  });
});

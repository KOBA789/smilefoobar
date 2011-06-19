/*
{
  text: text,
  attributes: {
    size: size,
    position: position,
    color: color
  }
}
*/

var parseCommand = function (commands) {
  var sizes = ['big', 'midium', 'small'];
  var positions = ['naka', 'ue', 'shita'];
  var colors = ['white', 'red', 'blue', 'yellow', 'green','orange', 'pink', 'cyan', 'purple', 'black'];
  
  var size = 'midium';
  var position = 'naka';
  var color = 'white';
  
  var commandsArray = commands.split(' ');
  commandsArray.forEach(function (command) {
    if (sizes.indexOf(command)) {
      size = command;
    }
    if (positions.indexOf(command)) {
      position = command;
    }
    if (colors.indexOf(command)) {
      color = command;
    }
  });
  
  var attributes = {
    size: size,
    position: position,
    color: color
  }
  
  return attributes;
}

var displayWidth = $('#display').width();
var displayHeight = $('#display').height();

var messageQueue = [];

var elements = {
  ue: [],
  naka: [],
  shita: []
};

var findSpace = function (myHeight, position) {
  cssPosition = (position == 'shita') ? 'bottom' : 'top';
  
  var myTop = 0, i = 0;
  for (i = 0; i < elements[position].length; i++) {
    var top = Number(elements[position][i].css(cssPosition).replace('px', ''));
    var height = elements[position][i].height();
    if (myTop + myHeight <= top) {
      break;
    } else {
      myTop = height + top;
    }
  }
  return {top: myTop, index: i, cssPosition: cssPosition};
}

var deploy = function (message) {
  var element = $('<div class="message"></div>');
  element.text(message.text);
  $('#display').append(element);
  element.css('color', message.attributes.color);
  element.css('font-size', ({big: '70', midium: '50', small: '30'})[message.attributes.size] + 'px');
  
  var property = findSpace(element.height(), message.attributes.position);
  element.css(property.cssPosition, property.top);
  element.css('width', '100%');
  elements[message.attributes.position].splice(property.index, 0, element);
  
}

addMessage = function (message) {
  message.attributes = parseCommand([message.attributes.size, message.attributes.position, message.attributes.color].join(' '));
  message.time = 0;
  messages[message.attributes.position].push(message);
}

var move = function () {
  var i = 0;
  var topOffset = 0;
  while (i < messages.ue) {
    var message = messages[i];
    if (message.time >= 4000) {
      messages.shift();
    } else {
      message.y = topOffset;
      i++;
    }
  }
  messageQueue.forEach(deploy);
}

$(document).ready(function () {
  /*
  socket = new io.Socket();
  socket.connect();
  socket.on('message', function(data){
    
  });
  */
  //setInterval(move, 50);
  
  deploy({
    text: '<i>わろす</i>',
    attributes: {
      size: 'midium',
      position: 'shita',
      color: 'red'
    }
  });
  
  deploy({
    text: '<i>わろす2</i>',
    attributes: {
      size: 'midium',
      position: 'ue',
      color: 'red'
    }
  });
  
  deploy({
    text: '<i>わろす3</i>',
    attributes: {
      size: 'midium',
      position: 'ue',
      color: 'red'
    }
  });
  
  elements.ue.shift().remove();
  deploy({
    text: '<i>わろす4</i>',
    attributes: {
      size: 'midium',
      position: 'naka',
      color: 'red'
    }
  });
});

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
    if (sizes.indexOf(command) != -1) {
      size = command;
    }
    if (positions.indexOf(command) != -1) {
      position = command;
    }
    if (colors.indexOf(command) != -1) {
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

var displayWidth, displayHeight;

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

  i = (position == 'naka') ? elements[position].length : i;
  
  return {top: myTop, index: i, cssPosition: cssPosition};
}

var deploy = function (message) {  
  message.attributes = parseCommand([message.attributes.size, message.attributes.position, message.attributes.color].join(' '));
  
  var element = $('<div class="message"></div>');
  element.text(message.text);
  element.css('visibility', 'hidden');
  $('#display').append(element);
  element.css('color', message.attributes.color);
  element.css('font-size', ({big: '70', midium: '50', small: '30'})[message.attributes.size] + 'px');
  element.time = 0;
  
  var property = findSpace(element.height(), message.attributes.position);
  element.css(property.cssPosition, property.top);
  if (message.attributes.position != 'naka') {
    element.css('text-align', 'center');
    element.css('width', '100%');
  }
  console.log(property.index);
  elements[message.attributes.position].splice(property.index, 0, element);
  //elements[message.attributes.position].push(element);
}

var move = function () {
  ['ue', 'shita', 'naka'].forEach(function (position) {
    var i = 0;
    while (i < elements[position].length) {
      var element = elements[position][i];
      if (element.time >= 4000) {
        element.remove();
        elements[position].splice(i, 1);
      } else {
        if (position == 'naka') {
          var width = element.width();
          var distance = displayWidth + width;
          var left = distance - distance * element.time / 4000 - width;
          element.css('left', left + 'px');
        }
        element.css('visibility', 'visible');
        i++;
        element.time += 50;
      }
    }
  });
  
  while (messageQueue.length > 0) {
    deploy(messageQueue.shift());
  }
}

$(document).ready(function () {
  displayWidth = $('#display').width();
  displayHeight = $('#display').height();
  /*
  socket = new io.Socket();
  socket.connect();
  socket.on('message', function(data){
    
  });
  */
  setInterval(move, 50);
  
  $("#send").click(function () {
    var text = $('#editor').val();
    messageQueue.push({
      text: text,
      attributes: parseCommand($('#command').val())
    });
    $('#editor').val('');
  });
  
  $("#post").submit(function () {
    $("#send").click();
    return false;
  });
});

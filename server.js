
// riso colors
const colors = require('riso-colors');
// HTTP Portion
var http = require('http');
// URL module
var url = require('url');
var path = require('path');

// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(8080);

console.log('Server started on port 8080');

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  );
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(server);

var Users = 0;
var PixelPos = [0, 0];

var PublicGridData;

var IDs = [];

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {



    console.log("We have a new client: " + socket.id);
    Users = Users + 1;
    console.log("Number od Users : " + Users);

    const color = colors[Math.floor(Math.random() * colors.length)];



    IDs.push(socket.id);



    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mic',
      function (data) {


        console.log(IDs[0]);
        // console.log(data[IDs[0]]);


        var PublicData = {
          // UsersNo: Users,
          // [IDs]: {
          //    Volume: data[IDs[0]].Volume, color: color,
          // Position: { x: data[0].Grid.x, y: data[0].Grid.y }
          // }
        };


        io.sockets.emit('PublicData', PublicData);
        io.sockets.emit('PublicGridData', PublicGridData);

      }
    );

    socket.on('disconnect', function () {

      IDs = IDs.filter(item => item !== socket.id);
      console.log("Client has disconnected");
      Users = Users - 1;
      console.log("Number of Users : " + Users);
    });
  }
);

function AssisgnRandomPixel(columnsNo, rowsNo) {
  var RPixelEntry = {

    x: Math.floor(Math.random() * columnsNo),
    y: Math.floor(Math.random() * rowsNo)

  };

  return RPixelEntry;
}

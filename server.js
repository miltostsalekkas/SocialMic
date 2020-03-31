
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

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {



    console.log("We have a new client: " + socket.id);
    Users = Users + 1;
    console.log("Number od Users : " + Users);

    const color = colors[Math.floor(Math.random() * colors.length)];

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mic',
      function (data) {
        // Data comes in as whatever was sent, including objects
        // console.log("Received: 'Mic' "+ data.Volume+ " from "+data.Id );

        // Send it to all other clients
        //  socket.broadcast.emit('mic', data);


        var dataId = data.Id;
        var PublicData = {
          UsersNo: Users,
          [dataId]: {Volume: data.Volume,color: color}
        };


        // This is a way to send to everyone including sender
        io.sockets.emit('mic', PublicData);

      }
    );

    socket.on('disconnect', function () {
      console.log("Client has disconnected");
      Users = Users - 1;
      console.log("Number of Users : " + Users);
    });
  }
);

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + "/public"));


http.listen(80, function() {		// 80 is default for web browsers visiting a page
  console.log('listening on :80');
});

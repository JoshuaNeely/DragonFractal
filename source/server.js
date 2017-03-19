var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + "/public"));

if (process.argv[2]) {
	var port = process.argv[2];
} else {
	var port = 80;
}

http.listen(port, function() {		// 80 is default for web browsers visiting a page
  console.log('listening on :' + port);
});

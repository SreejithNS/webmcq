
//////////////////////////////////// Server.js ///////////////////////////////////

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require("ip");
var qdb = require('./database.js');
var server = io.of('/teacher');
var log = (data,name,left) =>{
  console.clear();
           //console.log('SERVER             : URL http://' + ip.address() + ':3000/');
           console.log("ActiveCli server.js: " + data.size);
  if(name) console.log("NewCli    server.js: " + name);
  if(left) console.log("LeftCli   server.js: " + left);
}

////////////////////////////////////  FILE SUPPLIERS ///////////////////////////////////////////
app.get('/favicon.ico', function(req, res) {
   res.sendFile(__dirname+'/res/ico/logo.ico');
});

app.use('/teacher', express.static(__dirname + '/admin/'));

app.get('/socket.io/socket.io.js', function(req, res) {
   res.sendFile(__dirname+'/socket.io/socket.io.js');
});

app.get('/', function(req, res) {
   res.sendFile(__dirname+'/res/home.html');
});

app.get('/css', function(req, res) {
   res.sendFile(__dirname+'/res/css/index.css');
});

app.get('/tcss', function(req, res) {
   res.sendFile(__dirname+'/res/css/toast.css');
});
app.get('/tjs', function(req, res) {
   res.sendFile(__dirname+'/res/js/toast.js');
});


app.get('/teacher', function(req, res) {
   res.sendFile(__dirname+'/admin/home.html');
});

app.get('/teacher/css', function(req, res) {
   res.sendFile(__dirname+'/admin/css/index.css');
});

////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////  SERVER SOCKET ////////////////////////////////////////////
var qcode;
var socketList = new Map();

io.on('connection', function(socket) {
    let sesId = socket.id;
    socketList.set(socket.id, {});
    //log(socketList,false,false);

    socket.on('login', function(data){
    	let list = Array.from(socketList.values());
        let user = socketList.get(sesId);
        user.sys  = data.sys;
        user.nam = data.nam;
        user.roll = data.roll;
        //console.log(list);
        server.emit('logged',list);
    });

  	socket.on("report",(data)=>{
  		qdb.qset.emit('rep',data);
  		qdb.requestReports(qcode); 
  	});

  	socket.on("disconnect",()=>{
  		let user = socketList.get(sesId);
      	socketList.delete(sesId);
      	let list = Array.from(socketList.values());
      	//console.log(list);
        server.emit('logged',list);
  	});

    qdb.qset.on('report_data',(data)=>{ 
        server.emit('report_data',data); 
    });

});


////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////// TEACHER ///////////////////////////////////////////////////////////
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

server.on('connection',function(socket){
  socket.on('qset',(code)=>{
    qcode = code;
    qdb.qcode(code);
  });

  socket.on('insert_questions',(data)=>{
    //console.log("insert_questions received"+data);
    qdb.insertQuestion(data,qcode);
  });

  socket.on('edit_questions',(data)=>{
    //console.log("insert_questions received"+data);
    qdb.editQuestion(data,qcode);
  });
 qdb.qset.on('questions_data',(data)=>{
    socket.emit('questions_data',data);
  });

	socket.on('start',function(){
		qdb.qset.emit('req',qcode);
  });

	socket.on('rep_cc',function(){
		//console.log("rep_cc");

		qdb.requestReports(qcode); // reqesting database for report data 

  		qdb.qset.on('report_data',(data)=>{ // when report data is received from the database
  			//console.log("Report Data received");
  			socket.emit('report_data',data); // sending the reports to teacher by emiting ('report_data')
  		});
  	});

  	socket.on('questions_pull',function(){

  		qdb.requestQuestions(qcode);

  		/*qdb.qset.on('questions_data',(data)=>{
  			//console.log("Questions Data received");
  			socket.emit('questions_data',data);
  		});*/

	});

     

});



http.listen(80, function() {
   console.log('Http      server.js: URL http://' + ip.address() + ':3000/');
});
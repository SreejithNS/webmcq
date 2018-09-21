
//////////////// SQlite3 integration for Database Management ////////////////////////

const EventEmitter = require('events');

var sqlite3 = require('sqlite3');

///// DB connection /////

let db = new sqlite3.Database('db/quest.db');
 


 exports.qset= new EventEmitter();


exports.qset.on('req',function(req) {
	let sql = "SELECT * FROM '" + req + "' ";

	var result;

	db.all(sql, [], (err, row) => {
  	if (err) {
    return false,console.error(err.message);
  	}

  //console.log(row);

 	 exports.qset.emit('res',row);
	});
	
});

exports.qset.on('rep',function(rep){
	var roll = rep.roll, name = rep.nam, sys = rep.sys, mis = rep.mistake , totmis = rep.totmistake, total = rep.total;

	let sql = "INSERT INTO '12sqset1_report' ( roll , name , sys , mistakes , totalmistakes , total ) VALUES (" + roll + ",' "+ name +"',"+ sys +",'"+ mis+"',"+ totmis +","+ total  +")";


	db.run(sql, [], (err) => {
  	if (err) {
    return false,console.error(err.message);
  	}
  	exports.qset.emit('rep_suc');
});
});

exports.requestReports = function(name) {

	let sql = "SELECT * FROM '" + name + "_report'";

	db.all(sql, [], (err,res) => {
  	if (err) {
    return false,console.error(err.message);
  	}
  	let data = JSON.stringify(res);
  	exports.qset.emit('report_data',data);
});
};

exports.requestQuestions = function(name){

	let sql = "SELECT * FROM '" + name + "'";

	db.all(sql, [], (err,res) => {
  	if (err) {
    return false,console.error(err.message);
  	}

  	let data = JSON.stringify(res);
  	exports.qset.emit('questions_data',data);
});
};

exports.insertQuestion = function(rdata,table){
	var data = JSON.parse(rdata);

	let sql = "INSERT INTO '"+ table +"' (`quest`,`opt1`,`opt2`,`opt3`,`opt4`,`ans`) VALUES ('"+ data.quest +"', '"+ data.opt1 +"', '"+data.opt2 +"', '"+data.opt3 +"', '"+data.opt4 +"', "+ parseInt(data.ans) +")";

	db.run(sql,[],(err)=>{
		console.log(err);
		return
	});
	console.log("insert_questions inserted into"+table);

	exports.requestQuestions(table);
};
exports.editQuestion = function(rdata,table){
	var data = JSON.parse(rdata);

	//let sql = "INSERT INTO '"+ table +"' (`quest`,`opt1`,`opt2`,`opt3`,`opt4`,`ans`) VALUES ('"+ data.quest +"', '"+ data.opt1 +"', '"+data.opt2 +"', '"+data.opt3 +"', '"+data.opt4 +"', "+ parseInt(data.ans) +")";
	let sql = "UPDATE '"+table+"' SET quest='"+data.quest+"',opt1='"+data.opt1+"',opt2='"+data.opt2+"',opt3='"+data.opt3+"',opt4='"+data.opt4+"',ans='"+data.ans+"' WHERE qno='"+data.qno+"';"
	db.run(sql,[],(err)=>{
		console.log(err);
		return
	});
	console.log("edit_questions edit on "+data.qno+"@"+table);

	exports.requestQuestions(table);
};


exports.qcode = (data) =>{
	var sql = "CREATE TABLE IF NOT EXISTS '"+ data +"' ( qno INTEGER PRIMARY KEY AUTOINCREMENT, quest TEXT, opt1 TEXT, opt2 TEXT, opt3 TEXT, opt4 TEXT, ans integer )";
	db.run(sql,[],(err)=>{
		if(err) console.log(err);
		return
	});
	
	sql = "CREATE TABLE IF NOT EXISTS'"+ data +"_report' ( roll INTEGER PRIMARY KEY, name text, sys integer, mistakes text, totalmistakes integer, total integer )";
	db.run(sql,[],(err)=>{
		if(err) console.log(err);
		return
	});
};


//
// close the database connection

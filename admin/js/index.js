
var socket = io('/teacher');
	var qset;
	if(localStorage.getItem('qset') === null){
		var temp = prompt("Enter the qset");
		qset = temp;
		socket.emit('qset',temp);
		localStorage.setItem('qset',temp);
		//console.log("Not set "+temp);
		loadSettings();
	}else{
		var temp = localStorage.getItem('qset');
		qset = temp;
		//console.log("set "+qset);
		socket.emit('qset',temp);
		loadSettings();
	}
	function toggle(id){
		var tabs = document.querySelectorAll(".tab");

		tabs.forEach((tab)=>{
			var name = tab.id.split('');
				name.splice(0,5);
				name = name.join('');

			if(tab.id == id){
				tab.style.backgroundColor = "#34495e";
				tab.style.color = "white";
				document.querySelectorAll('.page').forEach((page)=>{
				if(page.id !== name){

					page.style.display = "none";
				}else{
					document.getElementById("page-title").innerHTML=name;
					page.style.display = "inline-block";

				}
				});
			}else{	
				tab.style.color = "#576574";
				tab.style.backgroundColor = "transparent";			
			}
		});
	}

	toggle("page-online");

	document.querySelector('#start-but').onclick = ()=>{
		socket.emit('start');
	};

	function rep_cc(){
		socket.emit('rep_cc');
	}

	var insertQuestionModal = false;
	

	function loadSettings(){
		document.getElementById('settings-qset').value = qset;
	}

	function saveSettings(){
		var code = document.getElementById('settings-qset').value;
		qset = code;

		localStorage.setItem('qset',code);
		socket.emit('qset',code);
		document.getElementById('settings-modal').style.display = 'none';
		socket.emit("questions_pull");
	}



	function insertQuestion(){
		document.getElementById("insert-question-text").value = "";
		document.getElementById("opt-1").value = "";
		document.getElementById("opt-2").value = "";
		document.getElementById("opt-3").value = "";
		document.getElementById("opt-4").value = "";
		document.getElementById("right-opt").selectedIndex  = 0;
		if(!insertQuestionModal){
		document.querySelector("#insert-question").style.display = "inline-block";
		insertQuestionModal = true;
		}else{
			document.querySelector("#insert-question").style.display = "none";
			insertQuestionModal = false;
		}
	}
	var editQuestionModal = false;

	function editQuestion(id){
		var q = {};
		questions.forEach((question)=>{
			if(question.qno == id){
			 	q = question;
			}
		});
		document.getElementById("edit-question-no").innerHTML = id;
		document.getElementById("edit-question-text").value = q.quest;
		document.getElementById("edit-opt-1").value = q.opt1;
		document.getElementById("edit-opt-2").value = q.opt2;
		document.getElementById("edit-opt-3").value = q.opt3;
		document.getElementById("edit-opt-4").value = q.opt4;
		document.getElementById("edit-right-opt").selectedIndex  = q.ans;
		if(!editQuestionModal){
		document.querySelector("#edit-question").style.display = "inline-block";
		editQuestionModal = true;
		}else{
			document.querySelector("#edit-question").style.display = "none";
			editQuestionModal = false;
		}
	}
	function edit(){
		let qno = parseInt(document.getElementById("edit-question-no").innerHTML);
		let quest = document.getElementById("edit-question-text").value;
		let opt1 = document.getElementById("edit-opt-1").value;
		let opt2 = document.getElementById("edit-opt-2").value;
		let opt3 = document.getElementById("edit-opt-3").value;
		let opt4 = document.getElementById("edit-opt-4").value;
		let ans = document.getElementById("edit-right-opt").selectedIndex;

		var data = {
			qno : qno,
			quest : quest,
			opt1 : opt1,
			opt2 : opt2,
			opt3 : opt3,
			opt4 : opt4,
			ans : ans
		}

		let send_data = JSON.stringify(data);

		socket.emit('edit_questions',send_data);

		if(!editQuestionModal){
		document.querySelector("#edit-question").style.display = "inline-block";
		editQuestionModal = true;
		}else{
			document.querySelector("#edit-question").style.display = "none";
			editQuestionModal = false;
		}
	}

	function insert(){
		var question = document.getElementById("insert-question-text").value;
		var opt1 = document.getElementById("opt-1").value;
		var opt2 = document.getElementById("opt-2").value;
		var opt3 = document.getElementById("opt-3").value;
		var opt4 = document.getElementById("opt-4").value;
		var ans = document.getElementById("right-opt").selectedIndex;
		if(ans == 0){
			return alert('Please Select the Right answer!')
		}

		var data = {
			quest : question,
			opt1 : opt1,
			opt2 : opt2,
			opt3 : opt3,
			opt4 : opt4,
			ans : ans
		}

		let send_data = JSON.stringify(data);

		socket.emit('insert_questions',send_data);
		insertQuestion();
		document.getElementById("insert-question-text").value = "";
		document.getElementById("opt-1").value = "";
		document.getElementById("opt-2").value = "";
		document.getElementById("opt-3").value = "";
		document.getElementById("opt-4").value = "";
		document.getElementById("right-opt").selectedIndex  = 0;
	}
	var questions;
	socket.on('questions_data',(rdata)=>{

		toast("Questions Data Reloaded");
		var data = JSON.parse(rdata);
		questions = data;
		//console.log("Reports data received from server : ", data);

		var present = document.querySelector(".questions-table");
		if(present !== null) present.parentNode.removeChild(present);

		var tab = document.createElement('table');
		tab.className = "questions-table";

		var tr = document.createElement('tr');
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		var th4 = document.createElement('th');
		var th5 = document.createElement('th');
		var th6 = document.createElement('th');
		var th7 = document.createElement('th');

		th1.innerHTML = "Qst No.";
		tr.appendChild(th1);
		th2.innerHTML = "Question";
		tr.appendChild(th2);
		th3.innerHTML = "Option 1";
		tr.appendChild(th3);
		th4.innerHTML = "Option 2";
		tr.appendChild(th4);
		th5.innerHTML = "Option 3";
		tr.appendChild(th5);
		th6.innerHTML = "Option 4";
		tr.appendChild(th6);
		th7.innerHTML = "Answer";
		tr.appendChild(th7);

		tab.append(tr);
		var i=0;
		data.forEach((da)=>{
			var tr = document.createElement('tr');
			i++;
			for(var d in da){
				var td = document.createElement('td');
				if(d == "qno"){
				td.innerHTML = i;
				td.id = "qno"+da[d];
				td.className = "qno"
				var no = parseInt(da[d]);
				td.addEventListener("contextmenu", (e)=>{e.preventDefault();editQuestion(no)});
				tr.append(td);
				}else{
				td.innerHTML = da[d];
				tr.append(td);
				}
			};
			tab.append(tr);
		});
		document.querySelector('#questions').insertBefore(tab,document.querySelector('#questions').childNodes[4]);
		document.querySelectorAll('.questions-table tr').forEach((tr)=>{
			if(tr.innerHTML == "" || tr.innerHTML == null){
				//console.log(tr);
				tr.remove();
			}
		});
	});

	function listqp(){
		socket.emit('listqp',0);
	}

	socket.on('listQpapers',(rdata)=>{
		var data = JSON.parse(rdata);
		var present = document.querySelector("#qpaper-list-table");
		if(present !== null) present.parentNode.removeChild(present); 

		var tb = document.createElement('table'),
			tr = document.createElement('tr'),
			h1 = document.createElement('th'),
			h2 = document.createElement('th'),
			h3 = document.createElement('th'),
			h4 = document.createElement('th');
		
		h1.innerHTML = "Question Paper Code";
		h2.innerHTML = "Author";
		h3.innerHTML = "Subject";
		h4.innerHTML = "Class";

		tr.appendChild(h1);
		tr.appendChild(h2);
		tr.appendChild(h3);
		tr.appendChild(h4);
		tb.appendChild(tr);
		tb.className = "table";
		data.forEach((row)=>{
			var tr = document.createElement('tr');
			for(var dat in row){
				let d = document.createElement('td');
				d.innerHTML = row[dat];
				tr.appendChild(d);
			}
			tb.appendChild(tr);
		});
		document.getElementById("questions-manager").appendChild(tb);
		});

	socket.on('report_data',function(rdata){
		toast('Reports Updated');
		let data = JSON.parse(rdata);
		//console.log("Reports data received from server : ", data);

		var present = document.querySelector(".report-table");
		if(present !== null) present.parentNode.removeChild(present); 

		var tab = document.createElement('table');
		tab.className = "report-table";

		var tr = document.createElement('tr');
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		var th4 = document.createElement('th');
		var th5 = document.createElement('th');
		var th6 = document.createElement('th');

		th1.innerHTML = "Roll No.";
		tr.appendChild(th1);
		th2.innerHTML = "Name";
		tr.appendChild(th2);
		th3.innerHTML = "System";
		tr.appendChild(th3);
		th4.innerHTML = "Mistakn Questions";
		tr.appendChild(th4);
		th5.innerHTML = "Total Mistakes";
		tr.appendChild(th5);
		th6.innerHTML = "Scored Marks";
		tr.appendChild(th6);

		tab.append(tr);

		data.forEach((da)=>{
			var tr = document.createElement('tr');
			for(var d in da){
				var td = document.createElement('td');
				td.innerHTML = da[d];
				tr.append(td);
			};
			tab.append(tr);
		});
		document.querySelector('#reports').append(tab);
		document.querySelectorAll('.report-table tr').forEach((tr)=>{
			if(tr.innerHTML == "" || tr.innerHTML == null){
				//console.log(tr);
				tr.remove();
			}
		});

	});

	socket.on('logged',(logdata)=>{
		toast('New Student logged');
		var present = document.querySelector(".online-table");
		if(present !== null) present.parentNode.removeChild(present); 
		
		var tab = document.createElement('table');
		tab.className = "online-table";
		var tr = document.createElement('tr');
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		th1.innerHTML = "System"
		tr.append(th1);
		th2.innerHTML = "Name";
		tr.append(th2);
		th3.innerHTML = "Roll No.";
		tr.append(th3);
		tab.append(tr);

		logdata.forEach((id)=>{
			if(id !== {}) {
			var tr = document.createElement('tr');
				for (var d in id){
				var td = document.createElement('td');
				td.innerHTML = id[d];
				tr.append(td);
				};
			tab.append(tr);
			};
			
		});
		document.querySelector('#online').append(tab);
		document.querySelectorAll('.online-table tr').forEach((tr)=>{
			if(tr.innerHTML == "" || tr.innerHTML == null){
				//console.log(tr);
				tr.remove();
			}
		});
		
	});
	socket.on('userslist',(rdata)=>{
		let data = JSON.parse(rdata);

		var tb = document.createElement('table'),
			tr = document.createElement('tr'),
			h1 = document.createElement('th'),
			h2 = document.createElement('th'),
			h3 = document.createElement('th'),
			h4 = document.createElement('th');

		h1.innerHTML = "Username";
		h2.innerHTML = "Password";
		h3.innerHTML = "Full Name";
		h4.innerHTML = "User Type";

		tr.appendChild(h1);
		tr.appendChild(h2);
		tr.appendChild(h3);
		tr.appendChild(h4);
		tb.appendChild(tr);	

		///// INCOMPLETED
	});




$("*.sub-page").hide();
$(".login-screen").hide();
listqp();

var crQp = {};
crQp.it = 1;
crQp.add = ()=>{
	crQp.it += 1;
	let i = crQp.it;
	var tr = document.createElement('tr');
	for(var j=1;j<=7;j++){
		var td = document.createElement('td');
		if(j == 1){
			var span = document.createElement('span');
			span.className = "n"+i;
			span.innerHTML = i;
			td.appendChild(span);
			tr.appendChild(td);
		}else if(j == 2){
			var input = document.createElement('textarea');
			input.className = "n"+i;
			td.appendChild(input);
			tr.appendChild(td);
		}else if(j > 2 && j < 7){
			var input = document.createElement('input');
			input.className = "n"+i;
			input.type = "text";
			td.appendChild(input);
			tr.appendChild(td);
		}else if(j==7){
			var select = document.createElement('select');
			select.className = "n"+i;
			for(var k = 0;k<=4;k++){
				var option = document.createElement('option');
				if(k==0){
					option.value = "none";
					option.innerHTML = "Select Option";
				}else{
					option.value = k;
					option.innerHTML=k;
				}
				select.appendChild(option);
			}
			td.appendChild(select);
			tr.appendChild(td);
		}
	}
	document.getElementById('crqp').appendChild(tr);
};
crQp.delete = ()=>{
	if(crQp.it > 1){
 	var row = document.getElementById('crqp');
  	row.removeChild(row.lastChild);
  	crQp.it -= 1;
  }
};

$("#add-user-but").on('click',()=>{
	$('#user-add-modal').fadeToggle()
	$('#cr-username').val('')
	$('#cr-password').val('')
	$('#cr-fullname').val('')
	$('#cr-usertype').val('')
});
$("#cr-user-close").on('click',()=>{
	$('#user-add-modal').fadeToggle()
	$('#cr-username').val('')
	$('#cr-password').val('')
	$('#cr-fullname').val('')
	$('#cr-usertype').val('')
});
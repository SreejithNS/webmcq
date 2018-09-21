
var toastcount = 0;
function toast(data) {
	return "nothing"
	let to = toastcount++;
	let bar = document.createElement('div');
	bar.className = "bar";
	bar.id = "toast"+to;
	bar.innerHTML = data;
	bar.onclick = ()=> this.parentElement.removeChild(this);
	document.getElementById('toast-container').append(bar);
	var c = 2;
	document.getElementById('toast'+to).addEventListener("animationend",()=> {
		c--;
		if(c == 0){
		//document.getElementById('toast'+toastcount).parentElement.removeChild(document.getElementById('toast'+toastcount));
		document.getElementById('toast'+to).remove();
		}
	});
}
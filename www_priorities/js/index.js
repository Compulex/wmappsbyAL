/**
 * Priorities
 * Make task object, put each object in array, then order by urgency then importance then time it takes 
 */

var tinput = document.getElementById("task_input"); //task text
var ntime = document.getElementById("time_input"); //num time
var ttime = document.getElementById("time_sel"); //time type (secs, mins, hrs)
var urge = document.getElementById("urge_level"); //urgency range
var must_do = document.getElementById("importance_level"); //importance range
var add_btn = document.getElementById("add_btn");
var load_btn = document.getElementById("load_btn");
var ul = document.getElementById("list_tasks");
var load_div = document.getElementById("load_div");

var tasks = [];
var prioritized = [];
var crossout = null;
//&#x1F527; wrench emoji

//addEventListeners
ttime.addEventListener("change", changeTime);
add_btn.addEventListener("click", addTask);
load_btn.addEventListener("click", prioritize);

function addTask(){
    if(tinput.value == ""){
        alert("Please type in a task");
    }
    else{
        //add to list
        var li = document.createElement('li');
        
        //able to delete item
        var del_span = document.createElement('span');
        del_span.setAttribute('class', 'delete');
        del_span.appendChild(document.createTextNode('\u00d7'));
        del_span.onclick = function(){
            delOpt(this);
        };
        
        //able to edit item
        var edit_span = document.createElement('span');
        edit_span.setAttribute('class', 'edit');
        edit_span.appendChild(document.createTextNode('\u270F'));
        edit_span.onclick = function(){
            editOpt(this);
        };

        //text span
        var text_span = document.createElement('span');
        text_span.setAttribute('class', 'textsp');
        text_span.innerHTML = tinput.value;

        //time span
        var time_span = document.createElement('span');
        time_span.setAttribute("class", "timesp");
        time_span.appendChild(document.createTextNode('\u23F1'));
        //show time
        var tooltip = document.createElement('span');
        tooltip.setAttribute("class", "tooltip");
        tooltip.innerHTML = ntime.value + " " + ttime.value;
        time_span.appendChild(tooltip);

        //urgent span
        var urgent_span = document.createElement('span');
        urgent_span.setAttribute("class", "urgentsp");
        for(let i = 0; i < urge.value; i++){
            urgent_span.appendChild(document.createTextNode('\u{1F6A8}'));
        }

        //importance span
        var amust_span = document.createElement('span');
        amust_span.setAttribute("class", "amustsp");
        for(let i = 0; i < must_do.value; i++){
            amust_span.appendChild(document.createTextNode('\u2757'));
        }
        
        //add all spans to list item
        li.appendChild(del_span);
        li.appendChild(document.createTextNode("|"));
        li.appendChild(edit_span);
        li.appendChild(text_span);
        li.appendChild(time_span);
        li.appendChild(urgent_span);
        li.appendChild(amust_span);

        //add list item to list
        ul.appendChild(li);

        //add task object
        var task = {
            name: tinput.value,
            time: ntime.value,
            timeType: ttime.value,
            urgent: urge.value,
            mustDo: must_do.value
        };
        tasks.push(task);
        
        //reset all
        tinput.value = "";
        ntime.value = 1;
        ttime.value = "seconds";
        urge.value = 3;
        must_do.value = 3;
    }//else -something typed in

    if(tasks.length > 1){ load_btn.style.visibility = "visible"; }

    //if changes were made
    if(load_div.style.display == "block"){ changesMade(true); }
}//addTask
            
function delOpt(dom){
    //get text from li element
    var del = dom.nextSibling.nextSibling.nextSibling.textContent;

    console.log(del);
    
    //find position of item
    var idx = -1;
    for(let t = 0; t < tasks; t++){
        if(tasks[t].name == del){ 
            idx = t;
            break;
        }
    }

    crossout = del; //deleted task after prioritizing

    //remove from array and list
    tasks.splice(idx, 1);
    
    //delete li element
    dom.parentNode.remove();

    //if changes were made
    if(load_div.style.display == "block"){  changesMade(false); }
}//delOpt

function editOpt(dom){
    //current li element 
    var li = dom.parentNode.children;
    //get text from li element
    var edit = dom.nextSibling.textContent;

    //find position of item in array
    var task = null;
    for(let t = 0; t < tasks.length; t++){
        if(tasks[t].name == edit){
            task = tasks[t];
            break;
        }
    }

    //set values of inputs
    tinput.value = task.name;
    ntime.value = task.time;
    ttime.value = task.timeType;
    urge.value = task.urgent;
    must_do.value = task.mustDo;

    //change button function
    var btn = document.getElementById("add_btn");
    btn.innerHTML = "EDIT";
    btn.onclick = function(){
        //new values for task from inputs
        task.name = tinput.value;
        task.time = ntime.value;
        task.timeType = ttime.value;
        task.urgent = urge.value;
        task.mustDo = must_do.value;

        //change on list
        dom.nextSibling.innerHTML = tinput.value;
        //tooltip for time
        li[3].lastChild.innerHTML = ntime.value + " " + ttime.value;

        //clear text then re-append emoji(s)
        //urgency
        li[4].innerHTML = "";
        for(let i = 0; i < urge.value; i++){
            li[4].appendChild(document.createTextNode('\u{1F6A8}'));
        }
        //importance
        li[5].innerHTML = "";
        for(let i = 0; i < must_do.value; i++){
            li[5].appendChild(document.createTextNode('\u2757'));
        }

        //reset all
        tinput.value = "";
        ntime.value = 1;
        ttime.value = "seconds";
        urge.value = 3;
        must_do.value = 3;
        //change back
        btn.innerHTML = "ADD";
        btn.onclick = function(){ addTask(); };
    };

    //if changes were made
    if(load_div.style.display == "block"){ changesMade(true); }
}//editOpt

function changeTime(){
    //hours 1-23
    if(ttime.value == "hours"){
        ntime.max = 23;
    }
    else{ //secs and mins 1-59
        ntime.max = 59;
    }
}//changeTime

function prioritize(){
    //sorting the array of task objects 
    tasks.sort(function(a, b){
        if(a.urgent < b.urgent || a.urgent == b.urgent){ 
            if(a.mustDo < b.mustDo || a.mustDo == b.mustDo){
                if(a.time < b.time){ return 1; }
            }
        }   
        else { return -1; }
    });

    //clear array if changes were made
    prioritized = [];

    //show the list of tasks to do in order
    load_div.style.display = "block";

    for(let i = 0; i < tasks.length; i++){
        var pTask = document.createElement("p");
        pTask.setAttribute("class", "pTask");
        prioritized.push(tasks[i].name);
        pTask.textContent = tasks[i].name;
        load_div.appendChild(pTask);
    }
}//prioritize

function changesMade(removeAll){
    
    var ps = document.querySelectorAll(".pTask");

    if(removeAll){ 
        load_div.style.display = "none";
        ps.forEach(p =>{
            p.remove();
        });
    }
    else{
        var id = prioritized.indexOf(crossout);

        ps[id].style.textDecoration = "line-through";

        prioritized.splice(id, 1);
    }
}//changesMade

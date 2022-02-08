/**
 * Priorities
 * Make task object, put each object in array, then order by urgency then importance then time it takes 
 */

var tinput = document.getElementById("task_input"); //task text
var diff = document.getElementById("diff_level"); //difficulty range
var urge = document.getElementById("urge_level"); //urgency range
var must_do = document.getElementById("importance_level"); //importance range
var add_btn = document.getElementById("add_btn");
var load_btn = document.getElementById("load_btn");
var ul = document.getElementById("list_tasks");
var load_div = document.getElementById("load_div");
var do_ol = document.getElementById("do_ol");
var defer_ol = document.getElementById("defer_ol");
var delegate_ol = document.getElementById("delegate_ol");
var delete_ol = document.getElementById("delete_ol");
var refresh_btn = document.getElementById("refresh");

var tasks = [];
var tset = new Set();

//addEventListeners
load_btn.addEventListener("click", prioritize);

function addTask(){
    if(tinput.value == ""){
        alert("Please type in a task");
    }
    else if(tset.has(tinput.value)){
        alert("Please eedit name of task to avoid confusion");
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

        //difficulty span
        var diff_span = document.createElement('span');
        diff_span.setAttribute("class", "diffsp");
        for(let i = 0; i < diff.value; i++){
            diff_span.appendChild(document.createTextNode('\u{1F926}'));
        }

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
        li.appendChild(diff_span);
        li.appendChild(urgent_span);
        li.appendChild(amust_span);

        //add list item to list
        ul.appendChild(li);

        //add task object
        var task = {
            name: tinput.value,
            diff: diff.value,
            urgent: urge.value,
            mustDo: must_do.value
        };
        tasks.push(task);
        tset.add(task.name);
        
        //reset all
        tinput.value = "";
        diff.value = 1;
        urge.value = 1;
        must_do.value = 1;
    }//else -something typed in

    if(tasks.length > 1){ load_btn.style.visibility = "visible"; }

    //if changes were made
    if(load_div.style.visibility == "visible"){ 
        load_div.style.visibility = "hidden";
        refresh_btn.style.visibility = "hidden";
        clearOL();
    }
}//addTask
            
function delOpt(dom){
    //get text from li element
    var del = dom.nextSibling.nextSibling.nextSibling.textContent;

    //find position of item
    var idx = -1;
    for(let t = 0; t < tasks; t++){
        if(tasks[t].name == del){ 
            idx = t;
            break;
        }
    }

    //remove from array and list
    tasks.splice(idx, 1);

    //delete from set to avoid duplicates
    tset.delete(del);
    console.log(tset);
    
    //delete li element
    dom.parentNode.remove();

    //if changes were made
    load_btn.style.visibility = "visible";

    load_div.style.visibility = "hidden";
    refresh_btn.style.visibility = "hidden";
    clearOL();
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

    //remove from set
    tset.delete(edit);
    console.log(tset);

    //set values of inputs
    tinput.value = task.name;
    diff.value = task.diff;
    urge.value = task.urgent;
    must_do.value = task.mustDo;

    //change button function
    var btn = document.getElementById("add_btn");
    btn.innerHTML = "EDIT";
    btn.onclick = function(){
        //new values for task from inputs
        task.name = tinput.value;
        task.diff = diff.value;
        task.urgent = urge.value;
        task.mustDo = must_do.value;

        //add edited name of task to set
        tset.add(task.name);

        //change on list
        li[2].innerHTML = tinput.value;

        //clear text then re-append emoji(s)
        //difficulty
        li[3].innerHTML = "";
        for(let i = 0; i < diff.value; i++){
            li[3].appendChild(document.createTextNode('\u{1F926}'));
        }

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
        diff.value = 1;
        urge.value = 1;
        must_do.value = 1;

        //change back
        btn.innerHTML = "ADD";
        btn.onclick = function(){ addTask(); };

        load_btn.style.visibility = "visible";

        load_div.style.visibility = "hidden";
        refresh_btn.style.visibility = "hidden";
        clearOL();
    };
}//editOpt

function prioritize(){
    load_btn.style.visibility = "hidden";
    var doIt = [], defer = [], delegate = [], deleteIt = [];

    //distribute tasks to different arrays
    tasks.forEach(function(task){
        //append to doIt list
        if(task.urgent >= 3 && task.mustDo >= 3){
            doIt.push(task);
        }
        //append to defer list
        else if(task.urgent <= 2 && task.mustDo >= 3){
            defer.push(task);
        }
        //append to delegate list 
        else if(task.urgent >= 3 && task.mustDo <= 2){
            delegate.push(task);
        }
        //append to delete list
        else if(task.urgent <= 2 && task.mustDo <= 2){
            deleteIt.push(task);
        }
    });

    //sort each array from most difficult to least
    doIt.sort(function(a, b){
        return b.diff - a.diff;
    });
    defer.sort(function(a, b){
        return b.diff - a.diff;
    });
    delegate.sort(function(a, b){
        return b.diff - a.diff;
    });
    deleteIt.sort(function(a, b){
        return b.diff - a.diff;
    });

    //show the list of tasks to do in order
    load_div.style.visibility = "visible";
    refresh_btn.style.visibility = "visible";

    //fill in order
    fillInList(do_ol, doIt);
    fillInList(defer_ol, defer);
    fillInList(delegate_ol, delegate);
    fillInList(delete_ol, deleteIt);
}//prioritize

function fillInList(ol, arr){
    for(let i = 0; i < arr.length; i++){
        let li = document.createElement("li");
        li.innerHTML = arr[i].name;
        ol.appendChild(li);
    }
}//fillInList

function clearOL(){
    while(do_ol.firstChild){
        do_ol.removeChild(do_ol.firstChild);
    }
    while(defer_ol.firstChild){
        defer_ol.removeChild(defer_ol.firstChild);
    }
    while(delegate_ol.firstChild){
        delegate_ol.removeChild(delegate_ol.firstChild);
    }
    while(delete_ol.firstChild){
        delete_ol.removeChild(delete_ol.firstChild);
    }
}//clearOL

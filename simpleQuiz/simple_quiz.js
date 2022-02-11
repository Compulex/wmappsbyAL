/**
 * Create a Simple Quiz.
 * The most common question types in a quiz: multiple choice, True/False, 
 * Fill in the blank, open-ended both short and long, and a check all that apply.
 * You can print or save the page as a pdf file and send it
 */

var h3 = document.getElementById("qTitle");
var qtinput = document.getElementById("quiz_title");
var questions_ol = document.getElementById("questions");
var li = null;
var qnum = 1;

//functions

function nameQuiz(){
    h3.innerHTML = qtinput.value;
}//nameQuiz

function makeQuestion(){
    li = document.createElement("li");
    let id = "question" + qnum;
    li.setAttribute("id", id);

    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter Question or Prompt";

    var span = document.createElement("span");
    span.setAttribute('class', 'delete');
    span.appendChild(document.createTextNode('\u00d7'));
    span.onclick = function(){
        this.parentNode.remove();
    }

    li.appendChild(input);
    li.appendChild(span);

    qnum++;
}//makeQuestion

function makeMC(){
    makeQuestion();
    //ordered list for multiple choice
    var ol = document.createElement("ol");
    ol.style.listStyleType = "lower-alpha";
    
    for(let i = 0; i < 4; i++){
        var a = document.createElement("li");
        var choice = document.createElement("input");
        choice.type = "text";
        choice.placeholder = "Enter Answer";
        a.appendChild(choice);
        ol.appendChild(a);
    }
    li.appendChild(ol);

    questions_ol.appendChild(li);
}// multiple choice

function makeTF(){
    makeQuestion();

    li.appendChild(document.createTextNode(" T \xa0 F"));

    questions_ol.appendChild(li);
}// true or false

function makeFIB(){
    makeQuestion();
    //change placeholder
    li.children[0].placeholder = "Put underscores in prompt";
    questions_ol.appendChild(li);
}// fill in blank

function makeShortOE(){
    makeQuestion();

    li.appendChild(document.createElement("br"));
    var short = document.createElement("input");
    short.type = "text";
    short.disabled = true;
    short.style.marginTop = "5px";
    short.style.marginBottom = "5px";
    li.appendChild(short);

    questions_ol.appendChild(li);
}// short open-ended

function makeLongOE(){
    makeQuestion();

    li.appendChild(document.createElement("br"));
    var ta = document.createElement("textarea");
    ta.disabled = true;
    ta.style.marginTop = "5px";
    ta.style.marginBottom = "5px";
    li.appendChild(ta);

    questions_ol.appendChild(li);
}// long open-ended

function makeCheckboxes(){
    makeQuestion();
    
    li.appendChild(document.createElement("br"));
    for(let i = 0; i < 4; i++){
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.disabled = true;
        var choice = document.createElement("input");
        choice.type = "text";
        choice.placeholder = "Enter Answer";

        li.appendChild(cb);
        li.appendChild(choice);
        li.appendChild(document.createElement("br"));
    }

    questions_ol.appendChild(li);
}// check all that apply question

function print(){
    var questions = questions_ol.children; //list items

    if(validateQuiz(questions)){
        sessionStorage.setItem("qTitle", h3.innerHTML);

        sessionStorage.setItem("qNum", questions.length);
        for(let q = 0; q < questions.length; q++){
            takeInData(questions[q], q);
        }
        window.open("quiz.html", "_blank");
    }
    else{
        alert("Double check and see if you filled in all the inputs");
    }    
}//print

function validateQuiz(qs){
    var filledIn = true;

    if(qtinput.value == ""){
        //qtinput.focus();
        qtinput.style.border = "2px solid #d0342c";
        qtinput.style.boxShadow = "5px 5px 5px #d0342c";
        filledIn = false;
    }
    else{
        qtinput.style.border = "1px solid black";
        qtinput.style.boxShadow = "none";
    }
    
    for(let q = 0; q < qs.length; q++){
        let prompt = qs[q].firstChild;
        let mc = qs[q].lastChild;
        if(prompt.value == ""){
            prompt.style.border = "2px solid #d0342c";
            prompt.style.boxShadow = "5px 5px 5px #d0342c";
            filledIn = false;
        }
        else{
            prompt.style.border = "1px solid black";
            prompt.style.boxShadow = "none";
        }

        //check if question is mc
        if(mc.tagName == "OL"){
            let abc = mc.children;
            for(let a = 0; a < 4; a++){
                let answ = abc[a].firstChild;
                if(answ.value == ""){
                    answ.style.border = "2px solid #d0342c";
                    answ.style.boxShadow = "5px 5px 5px #d0342c";
                    filledIn = false;
                }
                else{
                    answ.style.border = "1px solid black";
                    answ.style.boxShadow = "none";
                }
            }
        }
    }
    return filledIn;
}//validateQuiz

function takeInData(quest, n){
    var cloneNode = quest.cloneNode(true);
    var q = cloneNode.childNodes[0];
    //replace input with paragraph
    replaceIP(cloneNode, q);
    
    //remove x span
    cloneNode.children[1].remove();

    if(cloneNode.children[1] != undefined){
        if(cloneNode.children[1].tagName == "OL"){
            var ol = cloneNode.children[1];
            for(let c = 0; c < ol.childNodes.length; c++){
                let parent = ol.childNodes[c];
                let choice = parent.childNodes[0];
                replaceIP(parent, choice);
            }
        }
        else if(cloneNode.children[1].tagName == "BR"){
            if(cloneNode.children[2].tagName == "INPUT"){
                cloneNode.children[2].style.border = "none";
                cloneNode.children[2].style.borderBottom = "1px solid black";
            }
            else{
                cloneNode.children[1].remove(); //remove br tag
                for(let c = 1; c < cloneNode.children.length; c++){
                    var element = cloneNode.childNodes[c];
                    if(element.tagName == "INPUT"){
                        if(element.type == "text"){
                            var cinput = cloneNode.childNodes[c];
                            var label = document.createElement("label");
                            label.innerHTML = cinput.value;
                            cloneNode.replaceChild(label, cinput);
                            //replaceIP(cloneNode, cinput);
                        }
                        
                    }
                }
            }
        }
    }

    var id = "quest" + n;
    sessionStorage.setItem(id, cloneNode.innerHTML);
}//takeInData

function replaceIP(parent, old){
    //replace input with paragraph
    var p = document.createElement("p");
    p.innerHTML = old.value;
    //p.style.fontWeight = "bold";
    parent.replaceChild(p, old);
}//replaceIP
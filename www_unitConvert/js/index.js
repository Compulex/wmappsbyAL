/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Add units of measurement options to select and opt group 
 * Make conversions based on user input (multiples of #, divide by, etc..)
 */

var type_sel = document.getElementById("type_meas");
var type = null;
var sel_a = document.getElementById("measure_a");
var sel_b = document.getElementById("measure_b");
var oga = document.getElementById("opt_a");
var ogb = document.getElementById("opt_b");
 
 
//liquid
var liq_measurements = ["teaspoons", "tablespoons", "fluid ounces", "cups", "pints", "quarts", "gallons"];
var liq_metrics = ["milliliters", "deciliters", "liters"];
//liq_multiples 
const tsp_tbsp = 3;
const tbsp_oz = 2;
const oz_cup = 8;
const cup_pt = 2;
const pt_qt = 2;
const qt_gal = 4;
//metric liq
const tsp_l = 203;
const tbsp_l = 67.628; 
const oz_l = 33.814;
const cup_l = 4.167;
const pt_l = 2.113;
const qt_l = 1.057;
const gal_l = 3.785;
 
 
//dry
var dry_measurements = ["ounces", "pints", "quarts", "gallons", "pounds", "tons"];
var dry_metrics = ["grams", "kilograms", "metric tons"];
//dry multiples
const oz_pts = 18.618;
const oz_lbs = 16; 
const qts_lbs = 2.086;
const gal_lbs = 8.345;
const lbs_ton = 2000;
const oz_ton = 32000;
//metric dry
const oz_g = 28.35;
const pts_g = 550.610;
const lbs_g = 454;
const ton_mton = 1.102;
 
 
//linear
var lin_measurements = ["inches", "feet", "yards", "miles"];
var lin_metrics = ["millimeters", "centimeters", "decimeters", "meters", "kilometers"];
//linear multiples
const in_ft = 12;
const ft_yd = 3;
const ft_mi = 5280;
//metric linear
const m_in = 39.37;
const in_cm = 2.54;
const m_ft = 0.3048;
const m_yd = 0.9144;
const m_mi = 1609.3;

//temp
var temp_measurements = ["celsius", "fahrenheit", "kelvin"];

//time
var time_measurements = ["seconds", "minutes", "hours", "days", "weeks", "months", "years"];
//time multiples
const secs_mins = 60;
const mins_hrs = 60;
const hrs_days = 24;
const days_wks = 7;
const days_yrs = 365;
const wks_mos = 4.35;
const mos_yrs = 12;

//first input 
var first_input = document.getElementById("num_a");
var output = document.getElementById("output");
var result = 0;

//set event listeners
type_sel.addEventListener("change", change_type);
first_input.addEventListener("input", conversion);
sel_a.addEventListener("change", conversion);
sel_b.addEventListener("change", conversion);
 
 
function removeOptions(parent){
    //delete options before optgroup
    let opt = parent.firstElementChild.nodeName;
    while(opt != "OPTGROUP"){
        parent.removeChild(parent.firstChild);
        opt = parent.firstElementChild.nodeName;
    }

    //delete options inside opt group
    let opt_grp = parent.firstChild;
    let first = opt_grp.firstChild;
    while(first != null){
        opt_grp.removeChild(opt_grp.firstChild);
        first = opt_grp.firstChild;
    }
}//removeOptions
 
function change_type(){
    type = type_sel.options[type_sel.selectedIndex].value;

    //remove children under each select object
    let fnode_a = sel_a.firstElementChild.nodeName;

    //what ever happens to the first select same for other select
    if(fnode_a != "OPTGROUP"){ 
        removeOptions(sel_a);
        removeOptions(sel_b);
    }

    //restore metric opt group if hidden from chosen types: temp and time
    displayOG(true);
    
    //clear input and output
    first_input.value = "";
    output.innerHTML = "";

    //types of measurements
    switch(type){
        case "liquid":
            sel_liquid();
            break;
        case "dry":
            sel_dry();
            break;
        case "linear":
            sel_linear();
            break;
        case "temp":
            sel_temp();
            break;
        case "time":
            sel_time();
            break;
    }//switch
}//change_type
 
 //create select for liquid measurements
function sel_liquid(){
    //add options to select
    addOpt(liq_measurements, sel_a, true, oga);
    addOpt(liq_measurements, sel_b, true, ogb);

    //add options to opt group
    addOpt(liq_metrics, oga, false);
    addOpt(liq_metrics, ogb, false);
}//sel_liquid
 
//create select for dry measurements
function sel_dry(){
    //add options to select
    addOpt(dry_measurements, sel_a, true, oga);
    addOpt(dry_measurements, sel_b, true, ogb);

    //add options to opt group
    addOpt(dry_metrics, oga, false);
    addOpt(dry_metrics, ogb, false);
}//sel_dry
 
//create select for linear measurements
function sel_linear(){
    //add options to select
    addOpt(lin_measurements, sel_a, true, oga);
    addOpt(lin_measurements, sel_b, true, ogb);

    //add options to opt group
    addOpt(lin_metrics, oga, false);
    addOpt(lin_metrics, ogb, false);
}//sel_linear

//create select for temperature measurements
function sel_temp(){
    //hide opt group
    displayOG(false);

    //add options to select
    addOpt(temp_measurements, sel_a, false);
    addOpt(temp_measurements, sel_b, false);
}//sel_temp

//create select for time measurements
function sel_time(){
    //hide opt group
    displayOG(false);

    //add options to select
    addOpt(time_measurements, sel_a, false);
    addOpt(time_measurements, sel_b, false);
}//sel_time

function displayOG(show){
    if(show){
        oga.style.display = "block";
        ogb.style.display = "block";
    }
    else{
        oga.style.display = "none";
        ogb.style.display = "none";
    }
}//displayOG
 
function addOpt(arr, obj, before, opt_grp=null){
    for(let i = 0; i < arr.length; i++){
        let opt = document.createElement("option");
        opt.setAttribute("value", arr[i]);
        opt.text = arr[i];

        //insert before optgroup 
        if(before){
            obj.insertBefore(opt, opt_grp);
        }
        else{
            obj.appendChild(opt);
        }
    }
}//addOpt
 
function conversion(){
    let fnum = Number(first_input.value);
    //let snum = output.text;
    let unit_a = sel_a.options[sel_a.selectedIndex].value;
    let unit_b = sel_b.options[sel_b.selectedIndex].value;

    switch(type){
        case "liquid":
            liq_convert(fnum, unit_a, unit_b);
            break;
        case "dry":
            dry_convert(fnum, unit_a, unit_b)
            break;
        case "linear":
            lin_convert(fnum, unit_a, unit_b);
            break;
        case "temp":
            temp_convert(fnum, unit_a, unit_b);
            break;
        case "time":
            time_convert(fnum, unit_a, unit_b);
            break;
    }//switch
}//conversion
 
//TODO: need to find an efficient way to convert each unit measurement... if possible
function liq_convert(f, from_unit, to){
    //liquid conversions 
    switch(from_unit){
    case "teaspoons":
        switch(to){
            case "teaspoons":
                result = f;
                break;
            case "tablespoons":
                result = f / tsp_tbsp;
                break;
            case "fluid ounces":
                result = f / (tsp_tbsp * tbsp_oz);
                break;
            case "cups":
                result = f / (tsp_tbsp * tbsp_oz * oz_cup);
                break;
            case "pints":
                result = f / (tsp_tbsp * tbsp_oz * oz_cup * cup_pt);
                break;
            case "quarts":
                result = f / (tsp_tbsp * tbsp_oz * oz_cup * cup_pt * pt_qt);
                break;
            case "gallons":
                result = f / (tsp_tbsp * tbsp_oz * oz_cup * cup_pt * pt_qt * qt_gal);
                break;
            //metric
            case "milliliters":
                result = (f / tsp_l) * 1000;
                break;
            case "deciliters":
                result = (f / tsp_l) * 10;
                break;
            case "liters":
                result = f / tsp_l;
                break;
        }
        break;
    case "tablespoons":
        switch(to){
            case "teaspoons":
                result = f * tsp_tbsp;
                break;
            case "tablespoons":
                result = f;
                break;
            case "fluid ounces":
                result = f / tbsp_oz;
                break;
            case "cups":
                result = f / (tbsp_oz * oz_cup);
                break;
            case "pints":
                result = f / (tbsp_oz * oz_cup * cup_pt);
                break;
            case "quarts":
                result = f / (tbsp_oz * oz_cup * cup_pt * pt_qt);
                break;
            case "gallons":
                result = f / (tbsp_oz * oz_cup * cup_pt * pt_qt * qt_gal);
                break;
            //metric
            case "milliliters":
                result = (f / tbsp_l) * 1000;
                break;
            case "deciliters":
                result = (f / tbsp_l) * 10;
                break;
            case "liters":
                result = f / tbsp_l;
                break;
        }
        break;
    case "fluid ounces":
        switch(to){
            case "teaspoons":
                result = f * tbsp_oz * tsp_tbsp;
                break;
            case "tablespoons":
                result = f * tbsp_oz;
                break;
            case "fluid ounces":
                result = f;
                break;
            case "cups":
                result = f / oz_cup;
                break;
            case "pints":
                result = f / (oz_cup * cup_pt);
                break;
            case "quarts":
                result = f / (oz_cup * cup_pt * pt_qt);
                break;
            case "gallons":
                result = f / (oz_cup * cup_pt * pt_qt * qt_gal);
                break;
            //metric
            case "milliliters":
                result = (f / oz_l) *1000;
                break;
            case "deciliters":
                result = (f / oz_l) * 10;
                break;
            case "liters":
                result = f / oz_l;
                break;
        }
        break;
    case "cups":
        switch(to){
            case "teaspoons":
                result = f * oz_cup * tbsp_oz * tsp_tbsp;
                break;
            case "tablespoons":
                result = f * oz_cup * tbsp_oz;
                break;
            case "fluid ounces":
                result = f * oz_cup;
                break;
            case "cups":
                result = f;
                break;
            case "pints":
                result = f / cup_pt;
                break;
            case "quarts":
                result = f / (cup_pt * pt_qt);
                break;
            case "gallons":
                result = f / (cup_pt * pt_qt * qt_gal);
                break;
            //metric
            case "milliliters":
                result = (f / cup_l) * 1000;
                break;
            case "deciliters":
                result = (f / cup_l) * 10;
                break;
            case "liters":
                result = f / cup_l;
                break;
        }
        break;
    case "pints":
        switch(to){
            case "teaspoons":
                result = f * cup_pt * oz_cup * tbsp_oz * tsp_tbsp;
                break;
            case "tablespoons":
                result = f * cup_pt * oz_cup * tbsp_oz;
                break;
            case "fluid ounces":
                result = f * cup_pt * oz_cup;
                break;
            case "cups":
                result = f * cup_pt;
                break;
            case "pints":
                result = f;
                break;
            case "quarts":
                result = f / pt_qt;
                break;
            case "gallons":
                result = f / (pt_qt * qt_gal);
                break;
            //metric
            case "milliliters":
                result = (f / pt_l) * 1000;
                break;
            case "deciliters":
                result = (f / pt_l) * 10;
                break;
            case "liters":
                result = f / pt_l;
                break;
        }
        break;
    case "quarts":
        switch(to){
            case "teaspoons":
                result = f * pt_qt * cup_pt * oz_cup * tbsp_oz * tsp_tbsp;
                break;
            case "tablespoons":
                result = f * pt_qt * cup_pt * oz_cup * tbsp_oz;
                break;
            case "fluid ounces":
                result = f * pt_qt * cup_pt * oz_cup;
                break;
            case "cups":
                result = f * pt_qt * cup_pt;
                break;
            case "pints":
                result = f * pt_qt;
                break;
            case "quarts":
                result = f;
                break;
            case "gallons":
                result = f / qt_gal;
                break;
            //metric
            case "milliliters":
                result = (f / qt_l) * 1000;
                break;
            case "deciliters":
                result = (f / qt_l) * 10;
                break;
            case "liters":
                result = f / qt_l;
                break;
        }
        break;
    case "gallons":
        switch(to){
            case "teaspoons":
                result = f * qt_gal * pt_qt * cup_pt * oz_cup * tbsp_oz * tsp_tbsp;
                break;
            case "tablespoons":
                result = f * qt_gal * pt_qt * cup_pt * oz_cup * tbsp_oz;
                break;
            case "fluid ounces":
                result = f * qt_gal * pt_qt * cup_pt * oz_cup;
                break;
            case "cups":
                result = f * qt_gal * pt_qt * cup_pt;
                break;
            case "pints":
                result = f * qt_gal * pt_qt;
                break;
            case "quarts":
                result = f * qt_gal;
                break;
            case "gallons":
                result = f;
                break;
            //metric
            case "milliliters":
                result = (f * gal_l) * 1000;
                break;
            case "deciliters":
                result = (f * gal_l) * 10;
                break;
            case "liters":
                result = f * gal_l;
                break;
        }
        break;
    //metric
    case "milliliters":
        switch(to){
            case "teaspoons":
                result = (f * tsp_l) / 1000;
                break;
            case "tablespoons":
                result = (f * tbsp_l) / 1000;
                break;
            case "fluid ounces":
                result = (f * oz_l) / 1000;
                break;
            case "cups":
                result = (f * cup_l) / 1000;
                break;
            case "pints":
                result = (f * pt_l) / 1000;
                break;
            case "quarts":
                result = (f * qt_l) / 1000;
                break;
            case "gallons":
                result = (f / gal_l) / 1000;
                break;
            //metric
            case "milliliters":
                result = f;
                break;
            case "deciliters":
                result = f / 100;
                break;
            case "liters":
                result = f / 1000;
                break;
        }
        break;
    case "deciliters":
        switch(to){
            case "teaspoons":
                result = (f * tsp_l) / 10;
                break;
            case "tablespoons":
                result = (f * tbsp_l) / 10;
                break;
            case "fluid ounces":
                result = (f * oz_l) / 10;
                break;
            case "cups":
                result = (f * cup_l) / 10;
                break;
            case "pints":
                result = (f * pt_l) / 10;
                break;
            case "quarts":
                result = (f * qt_l) / 10;
                break;
            case "gallons":
                result = (f / gal_l) / 10;
                break;
            //metric
            case "milliliters":
                result = f * 100;
                break;
            case "deciliters":
                result = f;
                break;
            case "liters":
                result = f / 10;
                break;
        }
        break;
    case "liters":
        switch(to){
            case "teaspoons":
                result = f * tsp_l;
                break;
            case "tablespoons":
                result = f * tbsp_l;
                break;
            case "fluid ounces":
                result = f * oz_l;
                break;
            case "cups":
                result = f * cup_l;
                break;
            case "pints":
                result = f * pt_l;
                break;
            case "quarts":
                result = f * qt_l;
                break;
            case "gallons":
                result = f / gal_l;
                break;
            //metric
            case "milliliters":
                result = f * 1000;
                break;
            case "deciliters":
                result = f * 10;
                break;
            case "liters":
                result = f;
                break;
        }
        break;
    }//switch
    output.innerHTML = result.toFixed(4);
}//liq_convert 
 
function dry_convert(f, from_unit, to){
    //dry conversions
    switch(from_unit){
        case "ounces":
            switch(to){
                case "ounces":
                    result = f;
                    break;
                case "pints":
                    result = f / oz_pts;
                    break;
                case "quarts":
                    result = f / (oz_pts * pt_qt);
                    break;
                case "gallons":
                    result = f / (oz_pts * pt_qt * qt_gal);
                    break;
                case "pounds":
                    result = f / oz_lbs;
                    break;
                case "tons":
                    result = f / (oz_lbs * lbs_ton);
                    break;
                //metric
                case "grams":
                    result = f * oz_g;
                    break;
                case "kilograms":
                    result = f * oz_g * 1000;
                    break;
                case "metric tons":
                    result = f / (oz_lbs * lbs_ton * ton_mton);
                    break;
            }
            break;
        case "pints":
            switch(to){
                case "ounces":
                    result = f * oz_pts;
                    break;
                case "pints":
                    result = f;
                    break;
                case "quarts":
                    result = f / pt_qt;
                    break;
                case "gallons":
                    result = f / (pt_qt * qt_gal);
                    break;
                case "pounds":
                    result = (f * oz_pts) / oz_lbs; //going off of logic past this point
                    break;
                case "tons":
                    result = (f * oz_pts) / (oz_lbs * lbs_ton);
                    break;
                //metric
                case "grams":
                    result = f * pts_g;
                    break;
                case "kilograms":
                    result = f * pts_g * 1000;
                    break;
                case "metric tons":
                    result = (f * oz_pts) / (oz_lbs * lbs_ton * ton_mton);
                    break;
            }
            break;
        case "quarts":
            switch(to){
                case "ounces":
                    result = f * oz_pts * pt_qt;
                    break;
                case "pints":
                    result = f * pt_qt;
                    break;
                case "quarts":
                    result = f;
                    break;
                case "gallons":
                    result = f / qt_gal;
                    break;
                case "pounds":
                    result = f / qts_lbs; //going off of logic past this point
                    break;
                case "tons":
                    result = f / (qts_lbs * lbs_ton);
                    break;
                //metric
                case "grams":
                    result = (f / qts_lbs) * lbs_g;
                    break;
                case "kilograms":
                    result = (f / qts_lbs) * lbs_g * 1000;
                    break;
                case "metric tons":
                    result = f / (qts_lbs * lbs_ton * ton_mton);
                    break;
            }
            break;
        case "gallons":
            switch(to){
                case "ounces":
                    result = f * qt_gal * pt_qt * oz_pts;
                    break;
                case "pints":
                    result = f * qt_gal * pt_qt;
                    break;
                case "quarts":
                    result = f * qt_gal;
                    break;
                case "gallons":
                    result = f;
                    break;
                case "pounds":
                    result = f * gal_lbs; //going off of logic past this point
                    break;
                case "tons":
                    result = f / (gal_lbs * lbs_ton);
                    break;
                //metric
                case "grams":
                    result = (f * gal_lbs) * lbs_g;
                    break;
                case "kilograms":
                    result = (f * gal_lbs) * lbs_g * 1000;
                    break;
                case "metric tons":
                    result = f / (gal_lbs * lbs_ton * ton_mton);
                    break;
            }
            break;
        case "pounds":
            switch(to){
                case "ounces":
                    result = f * oz_lbs;
                    break;
                case "pints":
                    result = f * oz_pts * oz_lbs;
                    break;
                case "quarts":
                    result = f * qts_lbs;
                    break;
                case "gallons":
                    result = f / gal_lbs;
                    break;
                case "pounds":
                    result = f;
                    break;
                case "tons":
                    result = f / lbs_ton;
                    break;
                //metric
                case "grams":
                    result = f * lbs_g;
                    break;
                case "kilograms":
                    result = f * lbs_g * 1000;
                    break;
                case "metric tons":
                    result = f / (lbs_ton * ton_mton);
                    break;
            }
            break;
        case "tons":
            switch(to){
                case "ounces":
                    result = f * oz_ton;
                    break;
                case "pints":
                    result = f * oz_pts * oz_ton;
                    break;
                case "quarts":
                    result = f * qts_lbs * lbs_ton;
                    break;
                case "gallons":
                    result = f / gal_lbs * lbs_ton;
                    break;
                case "pounds":
                    result = f * lbs_ton;
                    break;
                case "tons":
                    result = f;
                    break;
                //metric
                case "grams":
                    result = f * oz_ton * oz_g; //based on logic
                    break;
                case "kilograms":
                    result = f * oz_ton * oz_g * 1000; //based on logic
                    break;
                case "metric tons":
                    result = f / ton_mton;
                    break;
            }
            break;
        //metric
        case "grams":
            switch(to){
                case "ounces":
                    result = f * oz_g;
                    break;
                case "pints":
                    result = f * oz_pts * oz_g;
                    break;
                case "quarts":
                    result = (f / lbs_g) * qts_lbs;
                    break;
                case "gallons":
                    result = (f * lbs_g) / gal_lbs;
                    break;
                case "pounds":
                    result = f * lbs_g;
                    break;
                case "tons":
                    result = f / (lbs_ton * lbs_g);
                    break;
                //metric
                case "grams":
                    result = f;
                    break;
                case "kilograms":
                    result = f * 1000;
                    break;
                case "metric tons":
                    result = f / 1000000;
                    break;
            }
            break;
        case "kilograms":
            switch(to){
                case "ounces":
                    result = f * oz_g * 1000;
                    break;
                case "pints":
                    result = f * oz_pts * oz_g * 1000;
                    break;
                case "quarts":
                    result = (f / lbs_g) * qts_lbs * 1000;
                    break;
                case "gallons":
                    result = (f * lbs_g) / gal_lbs * 1000;
                    break;
                case "pounds":
                    result = f * lbs_g * 1000;
                    break;
                case "tons":
                    result = f / (lbs_ton * lbs_g * 1000);
                    break;
                //metric
                case "grams":
                    result = f * 1000;
                    break;
                case "kilograms":
                    result = f;
                    break;
                case "metric tons":
                    result = f / 1000;
                    break;
            }
            break;
        case "metric tons":
            switch(to){
                case "ounces":
                    result = f * oz_lbs * lbs_ton * ton_mton;
                    break;
                case "pints":
                    result = f * oz_pts * oz_lbs * lbs_ton * ton_mton;
                    break;
                case "quarts":
                    result = f * qts_lbs * lbs_ton * ton_mton;
                    break;
                case "gallons":
                    result = f * gal_lbs * lbs_ton * ton_mton;
                    break;
                case "pounds":
                    result = f * lbs_ton * ton_mton;
                    break;
                case "tons":
                    result = f * ton_mton;
                    break;
                //metric
                case "grams":
                    result = f * 1000000;
                    break;
                case "kilograms":
                    result = f * 1000;
                    break;
                case "metric tons":
                    result = f;
                    break;
            }
            break;
    }//switch
    output.innerHTML = result.toFixed(4);
}//dry_convert
 
function lin_convert(f, from_unit, to){
    //linear conversions
    switch(from_unit){
        case "inches":
            switch(to){
                case "inches":
                    result = f;
                    break;
                case "feet":
                    result = f / in_ft;
                    break;
                case "yards":
                    result = f / (in_ft * ft_yd);
                    break;
                case "miles":
                    result = f / (in_ft * ft_mi);
                    break;
                //metric
                case "millimeters":
                    result = (f / m_in) / 1000;
                    break;
                case "centimeters":
                    result = f * in_cm;
                    break;
                case "decimeters":
                    result = (f / m_in) / 10;
                    break;
                case "meters":
                    result = f / m_in;
                    break;
                case "kilometers":
                    result = (f / m_in) * 1000;
                    break;
            }
            break;
        case "feet":
            switch(to){
                case "inches":
                    result = f * in_ft;
                    break;
                case "feet":
                    result = f;
                    break;
                case "yards":
                    result = f / ft_yd;
                    break;
                case "miles":
                    result = f / ft_mi;
                    break;
                //metric
                case "millimeters":
                    result = (f * m_ft) / 1000;
                    break;
                case "centimeters":
                    result = (f * m_ft) / 100;
                    break;
                case "decimeters":
                    result = (f * m_ft) / 10;
                    break;
                case "meters":
                    result = f * m_ft;
                    break;
                case "kilometers":
                    result = (f * m_ft) * 1000;
                    break;
            }
            break;
        case "yards":
            switch(to){
                case "inches":
                    result = f * (in_ft * ft_yd);
                    break;
                case "feet":
                    result = f * ft_yd;
                    break;
                case "yards":
                    result = f;
                    break;
                case "miles":
                    result = f / (ft_mi * ft_yd);
                    break;
                //metric
                case "millimeters":
                    result = (f * m_yd) / 1000;
                    break;
                case "centimeters":
                    result = (f * m_yd) / 100;
                    break;
                case "decimeters":
                    result = (f * m_yd) / 10;
                    break;
                case "meters":
                    result = f * m_yd;
                    break;
                case "kilometers":
                    result = (f * m_yd) * 1000;
                    break;
            }
            break;
        case "miles":
            switch(to){
                case "inches":
                    result = f * (in_ft * ft_mi);
                    break;
                case "feet":
                    result = f * ft_mi;
                    break;
                case "yards":
                    result = f * (ft_mi * ft_yd);
                    break;
                case "miles":
                    result = f;
                    break;
                //metric
                case "millimeters":
                    result = (f * m_mi) / 1000;
                    break;
                case "centimeters":
                    result = (f * m_mi) / 100;
                    break;
                case "decimeters":
                    result = (f * m_mi) / 10;
                    break;
                case "meters":
                    result = f * m_mi;
                    break;
                case "kilometers":
                    result = (f * m_mi) * 1000;
                    break;
            }
            break;
        //metric
        case "millimeters":
            switch(to){
                case "inches":
                    result = (f * m_in) / 1000;
                    break;
                case "feet":
                    result = (f * m_ft) / 1000;
                    break;
                case "yards":
                    result = (f * m_yd) / 1000;
                    break;
                case "miles":
                    result = (f / m_mi) / 1000;
                    break;
                //metric
                case "millimeters":
                    result = f;
                    break;
                case "centimeters":
                    result = f / 10;
                    break;
                case "decimeters":
                    result = f / 100;
                    break;
                case "meters":
                    result = f / 1000;
                    break;
                case "kilometers":
                    result = f / 1000000;
                    break;
            }
            break;
        case "centimeters":
            switch(to){
                case "inches":
                    result = (f * m_in) / 100;
                    break;
                case "feet":
                    result = (f * m_ft) / 100;
                    break;
                case "yards":
                    result = (f * m_yd) / 100;
                    break;
                case "mile":
                    result = (f / m_mi) / 100;
                    break;
                //metric
                case "millimeters":
                    result = f * 10;
                    break;
                case "centimeters":
                    result = f;
                    break;
                case "decimeters":
                    result = f / 10;
                    break;
                case "meters":
                    result = f / 100;
                    break;
                case "kilometers":
                    result = f / 100000;
                    break;
            }
            break;
        case "decimeters":
            switch(to){
                case "inches":
                    result = (f * m_in) / 10;
                    break;
                case "feet":
                    result = (f * m_ft) / 10;
                    break;
                case "yards":
                    result = (f * m_yd) / 10;
                    break;
                case "mile":
                    result = (f / m_mi) / 10;
                    break;
                //metric
                case "millimeters":
                    result = f * 100;
                    break;
                case "centimeters":
                    result = f * 10;
                    break;
                case "decimeters":
                    result = f;
                    break;
                case "meters":
                    result = f / 10;
                    break;
                case "kilometers":
                    result = f / 10000;
                    break;
            }
            break;
        case "meters":
            switch(to){
                case "inches":
                    result = f * m_in;
                    break;
                case "feet":
                    result = f * m_ft;
                    break;
                case "yards":
                    result = f * m_yd;
                    break;
                case "mile":
                    result = f * m_mi;
                    break;
                //metric
                case "millimeters":
                    result = f / 1000;
                    break;
                case "centimeters":
                    result = f / 100;
                    break;
                case "decimeters":
                    result = f / 10;
                    break;
                case "meters":
                    result = f;
                    break;
                case "kilometers":
                    result = f * 1000;
                    break;
            }
            break;
        case "kilometers":
            switch(to){
                case "inches":
                    result = (f * m_in) * 1000;
                    break;
                case "feet":
                    result = (f * m_ft) * 1000;
                    break;
                case "yards":
                    result = (f * m_yd) * 1000;
                    break;
                case "mile":
                    result = (f / m_mi) * 1000;
                    break;
                //metric
                case "millimeters":
                    result = f / 1000000;
                    break;
                case "centimeters":
                    result = f / 100000;
                    break;
                case "decimeters":
                    result = f / 10000;
                    break;
                case "meters":
                    result = f / 1000;
                    break;
                case "kilometers":
                    result = f;
                    break;
            }
            break;
    }//switch
    output.innerHTML = result.toFixed(4);
}//lin_convert

function temp_convert(f, from_unit, to){
    //temperature conversions
    switch(from_unit){
        case "celsius":
            switch(to){
                case "celsius":
                    result = f;
                    break;
                case "fahrenheit":
                    result = (f * 1.8) + 32;
                    break;
                case "kelvin":
                    result = f + 273.15;
                    break;
            }
            break;
        case "fahrenheit":
            switch(to){
                case "celsius":
                    result = (f - 32) / 1.8;
                    break;
                case "fahrenheit":
                    result = f;
                    break;
                case "kelvin":
                    result = (f - 32) / 1.8 + 273.15;
                    break;
            }
            break;
        case "kelvin":
            switch(to){
                case "celsius":
                    result = f - 273.15;
                    break;
                case "fahrenheit":
                    result = (f - 273.15) * 1.8 + 32;
                    break;
                case "kelvin":
                    result = f;
                    break;
            }
            break;
    }//switch
    output.innerHTML = result.toFixed(2);
}//temp_convert

function time_convert(f, from_unit, to){
    //time conversions
    switch(from_unit){
        case "seconds":
            switch(to){
                case "seconds":
                    result = f;
                    break;
                case "minutes":
                    result = f / secs_mins;
                    break;
                case "hours":
                    result = f / (secs_mins * mins_hrs);
                    break;
                case "days":
                    result = f / (secs_mins * mins_hrs * hrs_days);
                    break;
                case "weeks":
                    result = f / (secs_mins * mins_hrs * hrs_days * days_wks);
                    break;
                case "months":
                    result = f / (secs_mins * mins_hrs * hrs_days * days_wks * wks_mos);
                    break;
                case "years":
                    result = f / (secs_mins * mins_hrs * hrs_days * days_yrs);
                    break;
            }
            break;
        case "minutes":
            switch(to){
                case "seconds":
                    result = f * secs_mins;
                    break;
                case "minutes":
                    result = f;
                    break;
                case "hours":
                    result = f / mins_hrs;
                    break;
                case "days":
                    result = f / (mins_hrs * hrs_days);
                    break;
                case "weeks":
                    result = f / (mins_hrs * hrs_days * days_wks);
                    break;
                case "months":
                    result = f / (mins_hrs * hrs_days * days_wks * wks_mos);
                    break;
                case "years":
                    result = f / (mins_hrs * hrs_days * days_yrs);
                    break;
            }
            break;
        case "hours":
            switch(to){
                case "seconds":
                    result = f * (secs_mins * mins_hrs);
                    break;
                case "minutes":
                    result = f * mins_hrs;
                    break;
                case "hours":
                    result = f;
                    break;
                case "days":
                    result = f / hrs_days;
                    break;
                case "weeks":
                    result = f / (hrs_days * days_wks);
                    break;
                case "months":
                    result = f / (hrs_days * days_wks * wks_mos);
                    break;
                case "years":
                    result = f / (hrs_days * days_yrs);
                    break;
            }
            break;
        case "days":
            switch(to){
                case "seconds":
                    result = f * (secs_mins * mins_hrs * hrs_days);
                    break;
                case "minutes":
                    result = f * (mins_hrs * hrs_days);
                    break;
                case "hours":
                    result = f * hrs_days;
                    break;
                case "days":
                    result = f;
                    break;
                case "weeks":
                    result = f / days_wks;
                    break;
                case "months":
                    result = f / (days_wks * wks_mos);
                    break;
                case "years":
                    result = f / days_yrs;
                    break;
            }
            break;
        case "weeks":
            switch(to){
                case "seconds":
                    result = f * (secs_mins * mins_hrs * hrs_days * days_wks);
                    break;
                case "minutes":
                    result = f * (mins_hrs * hrs_days * days_wks);
                    break;
                case "hours":
                    result = f * (hrs_days * days_wks);
                    break;
                case "days":
                    result = f * days_wks;
                    break;
                case "weeks":
                    result = f;
                    break;
                case "months":
                    result = f / wks_mos;
                    break;
                case "years":
                    result = f / (wks_mos * mos_yrs);
                    break;
            }
            break;
        case "months":
            switch(to){
                case "seconds":
                    result = f * (secs_mins * mins_hrs * hrs_days * days_wks * wks_mos);
                    break;
                case "minutes":
                    result = f * (mins_hrs * hrs_days * days_wks * wks_mos);
                    break;
                case "hours":
                    result = f * (hrs_days * days_wks * wks_mos);
                    break;
                case "days":
                    result = f * (days_wks * wks_mos);
                    break;
                case "weeks":
                    result = f * wks_mos;
                    break;
                case "months":
                    result = f;
                    break;
                case "years":
                    result = f / mos_yrs;
                    break;
            }
            break;
        case "years":
            switch(to){
                case "seconds":
                    result = f * (secs_mins * mins_hrs * hrs_days * days_yrs);
                    break;
                case "minutes":
                    result = f * (mins_hrs * hrs_days * days_yrs);
                    break;
                case "hours":
                    result = f * (hrs_days * days_yrs);
                    break;
                case "days":
                    result = f * days_yrs;
                    break;
                case "weeks":
                    result = f * (wks_mos * mos_yrs);
                    break;
                case "months":
                    result = f * mos_yrs;
                    break;
                case "years":
                    result = f;
                    break;
            }
            break;
    }//switch
    output.innerHTML = result.toFixed(2);
}//time_convert
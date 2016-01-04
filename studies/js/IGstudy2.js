/*
ChangeLog
3 Mar 13, Friday (For Version 30)
- Social version: Two simultaneous spinners
Added browser detection
8 Nov 12, Thursday (for Version 3)
- Added 50 colors, have sectors be randomized colors
- Fixed code to allow random sampling of the spinner values from a large dataset instead of a fixed one.
- Added "SpinnerID" to uniquely identify a spinner/win combination.
- Fixed "presentation Order" bug
- Added lots more "low-level" data (as opposed to keeping the winProbs, winChoice etc in data.trial)
  - e.g. added payoff1Array, payoff2Array, payoff3Array,
                prob1Array, prob2Array, prob3Array,
                winChoiceArray, winArray, winProbArray
- Populated new spinner dataset.
*/



var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
         string: navigator.userAgent,
         subString: "iPhone",
         identity: "iPhone/iPod"
      },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};
BrowserDetect.init();

/*
showSlide(id)
Displays each slide
*/

function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

/* 
random(a,b)
Returns random number between a and b, inclusive
*/

function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}


/* 
Array.prototype.random
Randomly shuffles elements in an array. Useful for condition randomization.
*/

Array.prototype.random = function() {
  return this[random(this.length)];
}

/* 
Produces an array with numbers 0~arrLength
in random order. Kind of spurious--use 
Array.prototype.random instead
*/

function shuffledArray(arrLength)
{
  var j, tmp;
  var arr = new Array(arrLength);
  for (i = 0; i < arrLength; i++)
  {
    arr[i] = i;
  }
  for (i = 0; i < arrLength-1; i++)
  {
    j = Math.floor((Math.random() * (arrLength - 1 - i)) + 0.99) + i;
    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/* 
Gets the value of the checked radio button
*/

function getRadioCheckedValue(formNum, radio_name)
{
   var oRadio = document.forms[formNum].elements[radio_name];
   for(var i = 0; i < oRadio.length; i++)
   {
      if(oRadio[i].checked)
      {
         return oRadio[i].value;
      }
   }
   return '';
}

function setQuestion(array) {
    var i = random(0, array.length - 1);
    var q = array[i];
    return q;
}


/* 
Clears value from form
*/

function clearForm(oForm) {
    
  var elements = oForm.elements; 
    
  oForm.reset();

  for(i=0; i<elements.length; i++) {
      
	field_type = elements[i].type.toLowerCase();
	
	switch(field_type) {
	
		case "text": 
		case "password": 
		case "textarea":
	        case "hidden":	
			
			elements[i].value = ""; 
			break;
        
		case "radio":
		case "checkbox":
  			if (elements[i].checked) {
   				elements[i].checked = false; 
			}
			break;

		case "select-one":
		case "select-multi":
            		elements[i].selectedIndex = -1;
			break;

		default: 
			break;
	}
    }
}

 Raphael.fn.printWin = function(x, y, num) {
  return this.text(x, y, "Bob won $" + num, this.getFont("Myriad")).attr("font-size", "24");
  };


Raphael.fn.triangle = function(x, y, size) {
  var path = ["M", x, y];
  path = path.concat(["L", (x + size / 2), (y + size)]);
  path = path.concat(["L", (x - size / 2), (y + size)]);
  return this.path(path.concat(["z"]).join(" "));
};

Raphael.fn.pieChart = function (cx, cy, r, ProbValues, PayoffValues, colors, fontSize, stroke) { 
  var paper = this,
  rad = Math.PI / 180,
  chart = this.set();
  

  function sector(cx, cy, r, startAngle, endAngle, params) {
    var x1 = cx + r * Math.cos(-startAngle * rad),
    x2 = cx + r * Math.cos(-endAngle * rad),
    y1 = cy + r * Math.sin(-startAngle * rad),
    y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  }
  function writeInSector(cx, cy, r, angle, PayoffValue, fontSize, params) {
    return paper.text(cx + (r*0.6) * Math.cos(-angle * rad),
      cy + (r*0.6) * Math.sin(-angle * rad),
      "$" + PayoffValue, paper.getFont("Myriad")).attr("font-size", fontSize);
  }

  var angle = 0,
  total = 0,
  start = 0,
  chosenColors = [],
  process = function (j) {
    var value = ProbValues[j],
    angleplus = 360 * value / total,
    popangle = angle + (angleplus / 2),
    color_name = 0;
    ms = 500,
    delta = 30,
    bcolor = Raphael.hsb(start, 1, 1),
    // color="90-" + bcolor + "-" + Raphael.hsb(start, .75, 1);
      
      color = colors[j].color;
    var p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, stroke: stroke, "stroke-width": 10});
    p.start = angle;
    p.end =  angle + angleplus;
    var pFont = writeInSector(cx, cy, r, angle+angleplus/2, PayoffValues[j], fontSize);
    p.color_name =  color_name;
    p.val= Math.round(100*(value/total));
    angle += angleplus;

    chart.push(p);
    chart.push(pFont);
    

    start += .1;
  };
  for (var i = 0, ii = ProbValues.length; i < ii; i++) {
    total += ProbValues[i];
  }
  for (i = 0; i < ii; i++) {
    process(i);
  }
  return chart;
};





// Input Data for the wheel



var allConditions = [
[
{"Version":"30", "SpinnerID":"1",  "probabilityVector":[.38, .36, .26],  "payoffVector":[0, 30, 60],   "winChoice":1},
{"Version":"30", "SpinnerID":"2",  "probabilityVector":[.42, .31, .27],  "payoffVector":[0, 30, 60],   "winChoice":2},
{"Version":"30", "SpinnerID":"3",  "probabilityVector":[.41, .37, .22],  "payoffVector":[0, 30, 60],   "winChoice":3},
{"Version":"30", "SpinnerID":"4",  "probabilityVector":[.5, .31, .19],   "payoffVector":[10, 35, 75],  "winChoice":1},
{"Version":"30", "SpinnerID":"5",  "probabilityVector":[.515, .3, .185], "payoffVector":[10, 35, 75],  "winChoice":2},
{"Version":"30", "SpinnerID":"6",  "probabilityVector":[.5, .32, .18],   "payoffVector":[10, 35, 75],  "winChoice":3},
{"Version":"30", "SpinnerID":"7",  "probabilityVector":[.47, .28, .25],  "payoffVector":[15, 70, 80],  "winChoice":1},
{"Version":"30", "SpinnerID":"8",  "probabilityVector":[.49, .27, .24],  "payoffVector":[15, 70, 80],  "winChoice":2},
{"Version":"30", "SpinnerID":"9",  "probabilityVector":[.45, .29, .26],  "payoffVector":[15, 70, 80],  "winChoice":3},
{"Version":"30", "SpinnerID":"10", "probabilityVector":[.43, .39, .18],  "payoffVector":[20, 45, 70],  "winChoice":1},
{"Version":"30", "SpinnerID":"11", "probabilityVector":[.41, .35, .24],  "payoffVector":[20, 45, 70],  "winChoice":2},
{"Version":"30", "SpinnerID":"12", "probabilityVector":[.40, .34, .26],  "payoffVector":[20, 45, 70],  "winChoice":3},
{"Version":"30", "SpinnerID":"13", "probabilityVector":[.31, .25, .44],  "payoffVector":[30, 50, 95],  "winChoice":1},
{"Version":"30", "SpinnerID":"14", "probabilityVector":[.33, .29, .38],  "payoffVector":[30, 50, 95],  "winChoice":2},
{"Version":"30", "SpinnerID":"15", "probabilityVector":[.30, .30, .40],  "payoffVector":[30, 50, 95],  "winChoice":3},
{"Version":"30", "SpinnerID":"16", "probabilityVector":[.45, .37, .18],  "payoffVector":[25, 60, 100], "winChoice":1},
{"Version":"30", "SpinnerID":"17", "probabilityVector":[.42, .38, .20],  "payoffVector":[25, 60, 100], "winChoice":2},
{"Version":"30", "SpinnerID":"18", "probabilityVector":[.43, .35, .22],  "payoffVector":[25, 60, 100], "winChoice":3},
{"Version":"30", "SpinnerID":"19", "probabilityVector":[.31, .32, .37],  "payoffVector":[25, 45, 80],  "winChoice":1},
{"Version":"30", "SpinnerID":"20", "probabilityVector":[.26, .32, .42],  "payoffVector":[25, 45, 80],  "winChoice":2},
{"Version":"30", "SpinnerID":"21", "probabilityVector":[.30, .30, .40],  "payoffVector":[25, 45, 80],  "winChoice":3},
{"Version":"30", "SpinnerID":"22", "probabilityVector":[.32, .16, .52],  "payoffVector":[20, 60, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"23", "probabilityVector":[.34, .22, .44],  "payoffVector":[20, 60, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"24", "probabilityVector":[.33, .20, .47],  "payoffVector":[20, 60, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"25", "probabilityVector":[.21, .36, .43],  "payoffVector":[15, 50, 75],  "winChoice":1},
{"Version":"30", "SpinnerID":"26", "probabilityVector":[.24, .40, .36],  "payoffVector":[15, 50, 75],  "winChoice":2},
{"Version":"30", "SpinnerID":"27", "probabilityVector":[.25, .38, .37],  "payoffVector":[15, 50, 75],  "winChoice":3},
{"Version":"30", "SpinnerID":"28", "probabilityVector":[.36, .40, .24],  "payoffVector":[40, 65, 100], "winChoice":1},
{"Version":"30", "SpinnerID":"29", "probabilityVector":[.38, .34, .28],  "payoffVector":[40, 65, 100], "winChoice":2},
{"Version":"30", "SpinnerID":"30", "probabilityVector":[.37, .32, .31],  "payoffVector":[40, 65, 100], "winChoice":3},
{"Version":"30", "SpinnerID":"31", "probabilityVector":[.54, .30, .16],  "payoffVector":[45, 60, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"32", "probabilityVector":[.52, .29, .19],  "payoffVector":[45, 60, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"33", "probabilityVector":[.50, .30, .20],  "payoffVector":[45, 60, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"34", "probabilityVector":[.43, .23, .34],  "payoffVector":[30, 50, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"35", "probabilityVector":[.41, .24, .35],  "payoffVector":[30, 50, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"36", "probabilityVector":[.39, .25, .36],  "payoffVector":[30, 50, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"37", "probabilityVector":[.28, .19, .53],  "payoffVector":[20, 50, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"38", "probabilityVector":[.30, .18, .52],  "payoffVector":[20, 50, 90],  "winChoice":2},
{"Version":"30", "SpinnerID":"39", "probabilityVector":[.32, .18, .50],  "payoffVector":[20, 50, 90],  "winChoice":3},
{"Version":"30", "SpinnerID":"40", "probabilityVector":[.27, .38, .35],  "payoffVector":[0, 40, 95],   "winChoice":1},
{"Version":"30", "SpinnerID":"41", "probabilityVector":[.27, .40, .33],  "payoffVector":[0, 40, 95],   "winChoice":2},
{"Version":"30", "SpinnerID":"42", "probabilityVector":[.26, .42, .32],  "payoffVector":[0, 40, 95],   "winChoice":3},
{"Version":"30", "SpinnerID":"43", "probabilityVector":[.55, .28, .17],  "payoffVector":[10, 50, 75],  "winChoice":1},
{"Version":"30", "SpinnerID":"44", "probabilityVector":[.58, .24, .18],  "payoffVector":[10, 50, 75],  "winChoice":2},
{"Version":"30", "SpinnerID":"45", "probabilityVector":[.60, .24, .16],  "payoffVector":[10, 50, 75],  "winChoice":3},
{"Version":"30", "SpinnerID":"46", "probabilityVector":[.26, .53, .21],  "payoffVector":[55, 70, 85],  "winChoice":1},
{"Version":"30", "SpinnerID":"47", "probabilityVector":[.28, .51, .21],  "payoffVector":[55, 70, 85],  "winChoice":2},
{"Version":"30", "SpinnerID":"48", "probabilityVector":[.25, .52, .23],  "payoffVector":[55, 70, 85],  "winChoice":3},
{"Version":"30", "SpinnerID":"49", "probabilityVector":[.30, .52, .18],  "payoffVector":[50, 75, 90],  "winChoice":1},
{"Version":"30", "SpinnerID":"50", "probabilityVector":[.32, .50, .18],  "payoffVector":[50, 75, 90],  "winChoice":2}
],
[
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2}
]
];






/* Experimental Variables */
// Number of conditions in experiment
var numConditions = 1; //allConditions.length;

// Randomly select a condition number for this particular participant
var chooseCondition = 1; // random(0, numConditions-1);

// Based on condition number, choose set of input (trials)
var allTrialOrders = allConditions[chooseCondition-1];

// Number of trials in each condition
var numTrials = 10; //not necessarily allTrialOrders.length;

// Produce random order in which the trials will occur
var shuffledOrder = shuffledArray(allTrialOrders.length);

// Keep track of current trial 
var currentTrialNum = 0;

// A variable special for this experiment because we're randomly
// choosing word orders as well
// var wordOrder = 100;
var trial;

// Keep track of how many trials have been completed
var numComplete = 0;


var colors = [{color_name:"AliceBlue",color:"#F0F8FF"}, 
            {color_name:"AntiqueWhite",color:"#FAEBD7"},
            {color_name:"Aqua",color:"#00FFFF"},
            {color_name:"Aquamarine",color:"#7FFFD4"},
            {color_name:"Bisque",color:"#FFE4C4"},
            {color_name:"Chocolate",color:"#D2691E"},
            {color_name:"CornflowerBlue",color:"#6495ED"},
            {color_name:"Crimson",color:"#DC143C"},
            {color_name:"DarkCyan",color:"#008B8B"},
            {color_name:"DarkGoldenRod",color:"#B8860B"},
            {color_name:"DarkKhaki",color:"#BDB76B"},
            {color_name:"DarkOliveGreen",color:"#556B2F"},
            {color_name:"DarkOrange",color:"#FF8C00"},
            {color_name:"DarkSalmon",color:"#E9967A"},
            {color_name:"DeepPink",color:"#FF1493"},
            {color_name:"DeepSkyBlue",color:"#00BFFF"},
            {color_name:"DodgerBlue",color:"#1E90FF"},
            {color_name:"ForestGreen",color:"#228B22"},
            {color_name:"Gold",color:"#FFD700"},
            {color_name:"GoldenRod",color:"#DAA520"},
            {color_name:"Gray",color:"#808080"},
            {color_name:"GreenYellow",color:"#ADFF2F"},
            {color_name:"IndianRed",color:"#CD5C5C"},
            {color_name:"Khaki",color:"#F0E68C"},
            {color_name:"Lavender",color:"#E6E6FA"},
            {color_name:"LemonChiffon",color:"#FFFACD"},
            {color_name:"LightBlue",color:"#ADD8E6"},
            {color_name:"LightCoral",color:"#F08080"},
            {color_name:"LightCyan",color:"#E0FFFF"},
            {color_name:"LightGray",color:"#D3D3D3"},
            {color_name:"MistyRose",color:"#FFE4E1"},
            {color_name:"Orange",color:"#FFA500"},
            {color_name:"OrangeRed",color:"#FF4500"},
            {color_name:"PaleGoldenRod",color:"#EEE8AA"},
            {color_name:"PaleGreen",color:"#98FB98"},
            {color_name:"PaleTurquoise",color:"#AFEEEE"},
            {color_name:"PaleVioletRed",color:"#DB7093"},
            {color_name:"PeachPuff",color:"#FFDAB9"},
            {color_name:"Peru",color:"#CD853F"},
            {color_name:"Pink",color:"#FFC0CB"},
            {color_name:"Plum",color:"#DDA0DD"},
            {color_name:"PowderBlue",color:"#B0E0E6"},
            {color_name:"SeaGreen",color:"#2E8B56"},
            {color_name:"Sienna",color:"#A0522D"},
            {color_name:"Silver",color:"#C0C0C0"},
            {color_name:"SteelBlue",color:"#4682B4"},
            {color_name:"Tan",color:"#D2B48C"},
            {color_name:"Tomato",color:"#FF6347"},
            {color_name:"Turquoise",color:"#40E0D0"},
            {color_name:"YellowGreen",color:"#9ACD32"}
            ];


/*
Show the instructions slide — this is what we want subjects to see first.
*/

if (BrowserDetect.browser != 'Chrome' && BrowserDetect.browser != 'Safari' && BrowserDetect.browser != 'Firefox') {
    alert ("Warning: We have not tested this HIT with your browser. We recommend Chrome, Firefox or Safari");
    $("#startButton").attr("disabled", "disabled");
}

$("#progressBar").hide();
showSlide("instructions");


// Updates the progress bar
$("#trial-num").html(numComplete);
$("#total-num").html(numTrials);

/*
The actual variable that will be returned to MTurk. The experiment object with various variables that you want to keep track of and return as results.
More practically, you should stick everything in an object and submit that whole object so that you don’t lose data (e.g. randomization parameters, what condition the subject is in, etc). Don’t worry about the fact that some of the object properties are functions — mmturkey (the Turk submission library) will strip these out.
*/

var experiment = {

/*
Parameters for this sequence.
*/
  condition: 1,

  startTime: 0,
  endTime: 0,
  firstPerson: Math.round(Math.random()),

  // An array of subjects' responses to each trial (NOTE: in the order in which
  // you initially listed the trials, not in the order in which they appeared)
  //results: new Array(numTrials),

  // The order in which each trial appeared
  //orders: new Array(numTrials),

  // The order in which each trial is presented. i.e. 
  // presentationOrder[i] = j means the i-th trial is the j-th one in the trial sequence.
  // Note that presentationOrder is now obsolete with spinnerIDArray
  // presentationOrder: new Array(numTrials),

  orderArray: new Array(numTrials),
  
  spinnerIDArray: new Array(numTrials),
  payoff1Array: new Array(numTrials),
  payoff2Array: new Array(numTrials),
  payoff3Array: new Array(numTrials),
  prob1Array: new Array(numTrials),
  prob2Array: new Array(numTrials),
  prob3Array: new Array(numTrials),
  winChoiceArray: new Array(numTrials),
  winArray: new Array(numTrials),
  winProbArray: new Array(numTrials),
  
  // My Results:
  happyResponseArray: new Array(numTrials),
  sadResponseArray: new Array(numTrials),
  angerResponseArray: new Array(numTrials),
  surpriseResponseArray: new Array(numTrials),
  disgustResponseArray: new Array(numTrials),
  fearResponseArray: new Array(numTrials),
  contentResponseArray: new Array(numTrials),
  disappResponseArray: new Array(numTrials),
  

  angleProportionArray: new Array(numTrials),

  reactionTimeArray: new Array(numTrials),

  socCompArray: new Array(10),
  RSEArray: new Array(10),
  LOTRArray: new Array(10),
  PHQArray: new Array(2),

  socCompScore: -1,
  RSE: -1,
  LOTR: -1,
  SINS: -1,
  PHQ: -1,



  // Demographics
  gender: "",
  age:"",
  nativeLanguage:"",
  browser: BrowserDetect.browser,
  browserVersion: BrowserDetect.version,
  browserOS: BrowserDetect.OS,
  comments:"",

 //trials: myTrialOrder,

/*
An array to store the data that we’re collecting.
*/

  data: [],

// Goes to description slide
  description: function() {
    $("#progressBar").show();
    showSlide("description");
    $("#tot-num").html(numTrials);
    $("#tot-num2").html(numTrials);

    if (turk.previewMode) {
      alert ( "Please accept the HIT before continuing." );;
    };

    if(experiment.firstPerson==0) {
      $('#firstPersonInstructions1').hide();
      $('#firstPersonInstructions').hide();
      $('#firstPersonResponse').hide();

    } else {
      $('#thirdPersonInstructions1').hide();
      $('#thirdPersonInstructions').hide();
      $('#thirdPersonResponse').hide();

      $('#freshGame').hide();
    }

  },

/*
The function that gets called when the sequence is finished.
*/

  end: function() {
  	// Records demographics
    experiment.gender = $('input[name="genderButton"]:checked').val();
    //experiment.age = $('select[name="ageRange"]').val();
    experiment.age = $('#ageRange').val();
    experiment.nativeLanguage = $('input[name="nativeLanguage"]').val();
    experiment.comments = $('textarea[name="commentsTextArea"]').val();

    // Show the finish slide.
    showSlide("finished");

    /*
    Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know we’re just submitting properties [i.e. data])
    */
    setTimeout(function() { turk.submit(experiment);}, 1500);
  },


  afterSocComp: function() {
    showSlide("questionnairesSlide");
        experiment.socCompArray[0] = parseInt($('input[name="socComp1"]:checked').val());
        experiment.socCompArray[1] = parseInt($('input[name="socComp2"]:checked').val());
        experiment.socCompArray[2] = parseInt($('input[name="socComp3"]:checked').val());
        experiment.socCompArray[3] = parseInt($('input[name="socComp4"]:checked').val());
        experiment.socCompArray[4] = parseInt($('input[name="socComp5"]:checked').val());
        experiment.socCompArray[5] = parseInt($('input[name="socComp6"]:checked').val());
        experiment.socCompArray[6] = parseInt($('input[name="socComp7"]:checked').val());
        experiment.socCompArray[7] = parseInt($('input[name="socComp8"]:checked').val());
        experiment.socCompArray[8] = parseInt($('input[name="socComp9"]:checked').val());
        experiment.socCompArray[9] = parseInt($('input[name="socComp10"]:checked').val());

        experiment.socCompScore = parseInt($('input[name="socComp1"]:checked').val()) +
        (10-parseInt($('input[name="socComp2"]:checked').val())) + (10-parseInt($('input[name="socComp3"]:checked').val())) +
        parseInt($('input[name="socComp4"]:checked').val()) + parseInt($('input[name="socComp5"]:checked').val()) +
        (10-parseInt($('input[name="socComp6"]:checked').val())) + (10-parseInt($('input[name="socComp7"]:checked').val())) +
        parseInt($('input[name="socComp8"]:checked').val()) + (10-parseInt($('input[name="socComp9"]:checked').val())) +
        parseInt($('input[name="socComp10"]:checked').val());

    
  },

  recordQuestionnaires: function() {
    showSlide("askInfo");

        experiment.RSEArray[0] = parseInt($('input[name="RSE1"]:checked').val());
        experiment.RSEArray[1] = parseInt($('input[name="RSE2"]:checked').val());
        experiment.RSEArray[2] = parseInt($('input[name="RSE3"]:checked').val());
        experiment.RSEArray[3] = parseInt($('input[name="RSE4"]:checked').val());
        experiment.RSEArray[4] = parseInt($('input[name="RSE5"]:checked').val());
        experiment.RSEArray[5] = parseInt($('input[name="RSE6"]:checked').val());
        experiment.RSEArray[6] = parseInt($('input[name="RSE7"]:checked').val());
        experiment.RSEArray[7] = parseInt($('input[name="RSE8"]:checked').val());
        experiment.RSEArray[8] = parseInt($('input[name="RSE9"]:checked').val());
        experiment.RSEArray[9] = parseInt($('input[name="RSE10"]:checked').val());
        experiment.LOTRArray[0] = parseInt($('input[name="LOTR1"]:checked').val());
        experiment.LOTRArray[1] = parseInt($('input[name="LOTR2"]:checked').val());
        experiment.LOTRArray[2] = parseInt($('input[name="LOTR3"]:checked').val());
        experiment.LOTRArray[3] = parseInt($('input[name="LOTR4"]:checked').val());
        experiment.LOTRArray[4] = parseInt($('input[name="LOTR5"]:checked').val());
        experiment.LOTRArray[5] = parseInt($('input[name="LOTR6"]:checked').val());
        experiment.LOTRArray[6] = parseInt($('input[name="LOTR7"]:checked').val());
        experiment.LOTRArray[7] = parseInt($('input[name="LOTR8"]:checked').val());
        experiment.LOTRArray[8] = parseInt($('input[name="LOTR9"]:checked').val());
        experiment.LOTRArray[9] = parseInt($('input[name="LOTR10"]:checked').val());
        
        experiment.PHQArray[0] = parseInt($('input[name="PHQ1"]:checked').val());
        experiment.PHQArray[1] = parseInt($('input[name="PHQ2"]:checked').val());

        experiment.RSE = parseInt($('input[name="RSE1"]:checked').val()) + 
        parseInt($('input[name="RSE2"]:checked').val()) - parseInt($('input[name="RSE3"]:checked').val()) +
        parseInt($('input[name="RSE4"]:checked').val()) - parseInt($('input[name="RSE5"]:checked').val()) +
        parseInt($('input[name="RSE6"]:checked').val()) + parseInt($('input[name="RSE7"]:checked').val()) -
        parseInt($('input[name="RSE8"]:checked').val()) - parseInt($('input[name="RSE9"]:checked').val()) -
        parseInt($('input[name="RSE10"]:checked').val()) + 15;
        experiment.LOTR = parseInt($('input[name="LOTR1"]:checked').val()) -
        parseInt($('input[name="LOTR3"]:checked').val()) + parseInt($('input[name="LOTR4"]:checked').val()) -
        parseInt($('input[name="LOTR7"]:checked').val()) - parseInt($('input[name="LOTR9"]:checked').val()) +
        parseInt($('input[name="LOTR10"]:checked').val()) + 24;
        experiment.SINS = parseInt($('input[name="SINS1"]:checked').val());
        experiment.PHQ = parseInt($('input[name="PHQ1"]:checked').val()) + parseInt($('input[name="PHQ2"]:checked').val());
        

  },


  next: function() {
        var charNameList = ["Alex", "Bob", "Charlie", "Chris", 
        "David", "Eric", "Frank", "George", "Jacob", "Jake", 
        "James", "John", "Josh", "Mike", "Scott", "Steve", "Tom", 
        "Will", "Zach", "Vince", "Ted", "Sean", "Ron", "Peter", 
        "Paul", "Mark", "Joe", "Nick", "Carl", "Kevin"];

        function refreshCharName() {
            return(charNameList[Math.floor(Math.random()*charNameList.length)]);
        };
        var bobName = refreshCharName(); 
        
        $('#CharName1').html(bobName);
        $('#CharName2').html(bobName);
        $('#CharName3').html(bobName);
        $('#CharName4').html(bobName);
        $('#CharName5').html(bobName);
        $('#CharName6').html(bobName);

    var probabilityVectorTotal;
    var angleStart;
    var angleEnd;
    var randProportion;
    //var bobStickFigure, hand_left, bobNameText, spinnerL, goButton, goButtonLabel;
    //var charlesStickFigure, hand_right, charlesNameText, spinnerR;
    
  showSlide("stage");
  $("#response").hide();
  
  if (numComplete == 0) { // First trial: create canvas.
      canvas=Raphael('wheel', 800, 300);
  }
  
  // If this is not the first trial, record variables
  if (numComplete > 0) {
    $('#freshGame').show();
    canvas.clear();

            experiment.happyResponseArray[numComplete-1] = $('input[name="happy"]:checked').val();
            experiment.sadResponseArray[numComplete-1] = $('input[name="sad"]:checked').val();
            experiment.angerResponseArray[numComplete-1] = $('input[name="anger"]:checked').val();
            experiment.surpriseResponseArray[numComplete-1] = $('input[name="surprise"]:checked').val();
            experiment.disgustResponseArray[numComplete-1] = $('input[name="disgust"]:checked').val();
            experiment.fearResponseArray[numComplete-1] = $('input[name="fear"]:checked').val();
            experiment.contentResponseArray[numComplete-1] = $('input[name="content"]:checked').val();
            experiment.disappResponseArray[numComplete-1] = $('input[name="disapp"]:checked').val();
                      
            experiment.endTime = (new Date()).getTime();
            experiment.reactionTimeArray[numComplete-1] = experiment.endTime - experiment.startTime;

            experiment.data.push(trial);
            
            $('input[name="happy"]:').prop('checked', false);
            $('input[name="sad"]:').prop('checked', false);
            $('input[name="anger"]:').prop('checked', false);
            $('input[name="surprise"]:').prop('checked', false);
            $('input[name="disgust"]:').prop('checked', false);
            $('input[name="fear"]:').prop('checked', false);
            $('input[name="content"]:').prop('checked', false);
            $('input[name="disapp"]:').prop('checked', false);
            
          }
        // If subject has completed all trials, update progress bar and
        // show slide to ask for demographic info
        if (numComplete >= numTrials) {
          $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
          $("#trial-num").html(numComplete);
          $("#total-num").html(numTrials);
          //showSlide("askInfo");
          showSlide("socialComparison");
        // Otherwise, if trials not completed yet, update progress bar
        // and go to next trial based on the order in which trials are supposed
        // to occur
      } else {
        $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
        $("#trial-num").html(numComplete);
        $("#total-num").html(numTrials);


        //currentTrialNum is used for randomizing later
        currentTrialNum = shuffledOrder[numComplete]; //numComplete //allTrialOrders[numComplete];
        trial = allTrialOrders[currentTrialNum];
        experiment.orderArray[numComplete] = numComplete+1;

        experiment.spinnerIDArray[numComplete] = trial.SpinnerID;

        probabilityVector = trial.probabilityVector;
        payoffVector = trial.payoffVector;
        winChoice = trial.winChoice;
        
        // winningAngle = 3000;

        // simple routine to calculate win angle.
        // normalizing 
        probabilityVectorTotal=0;
        angleStart = 0;
        for (var i = 0; i < probabilityVector.length; i++) {
          probabilityVectorTotal += probabilityVector[i];
          if (i<winChoice-1) {
            angleStart += probabilityVector[i];
          };
        };
        for (var i = 0; i < probabilityVector.length; i++) {
          probabilityVector[i] = probabilityVector[i] / probabilityVectorTotal;
        }
        angleStart = angleStart / probabilityVectorTotal;
        angleEnd = angleStart + probabilityVector[winChoice-1];
        // now the desired winning angle is between [angleStart, angleEnd] * 360 degrees
        randProportion = Math.random();
        // calculate winning angle = uniform draw from [angleStart, angleEnd] * 360 degrees
        // plus 5-10 rounds. Remember to offset - 90 degrees because the angles are calculated
        // from the positive x axis while the pointer is along the positive y axis.
        winningAngle = ((angleStart * (1-randProportion) + angleEnd * randProportion) 
        + 5 + Math.floor(Math.random()*5)) * 360 - 90;
        
        //probabilityVector = [.1, .3, .6];
        //payoffVector = [10, 5, 2];
            

            
        experiment.payoff1Array[numComplete] = payoffVector[0] ;
        experiment.payoff2Array[numComplete] = payoffVector[1] ;
        experiment.payoff3Array[numComplete] = payoffVector[2] ;
        experiment.prob1Array[numComplete] = probabilityVector[0] ;
        experiment.prob2Array[numComplete] = probabilityVector[1] ;
        experiment.prob3Array[numComplete] = probabilityVector[2] ;
        experiment.angleProportionArray[numComplete] = Math.round(randProportion*1000)/1000;
        experiment.winChoiceArray[numComplete] = winChoice;
        experiment.winArray[numComplete] = payoffVector[winChoice-1];
        experiment.winProbArray[numComplete] = probabilityVector[winChoice-1];      

        chosenColorsNum = shuffledArray(colors.length);        
        chosenColors = [];
        for (var l = 0; l<3; l++) {
          chosenColors[l] = colors[chosenColorsNum[l]];
        }

            


        // Creates spinner
        // if(askAboutLeftWheelFirst) {
          spinner = canvas.pieChart(canvas.width*2/3, 125, 100, probabilityVector, payoffVector,
            chosenColors, 24);
        
        // Adds pointers
        canvas.triangle(canvas.width*2/3, 5, 15).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");


        
        
        if(experiment.firstPerson==0) {
          bobStickFigure = canvas.image("https://www.stanford.edu/~dco/common/images/bob.jpeg", canvas.width/4-15, 65, 52, 128);
          bobNameText = canvas.text(canvas.width/4+20, 200, bobName).attr({'font-size': 24});
        }
        
        hand = canvas.image("https://www.stanford.edu/~dco/common/images/hand.png", canvas.width/4 + 12, 112, 64, 48).transform("r90");

        goButton = canvas.rect(canvas.width/4-20,20,90,25,0).attr({fill: "#0f0"});
        goButtonLabel = canvas.text(canvas.width/4+25,10,"Go!");

        goButton.show();
        //goButtonLabel.hide();

          goButton.click(function() {
            hand.animate(
              {transform: "r90,T" + (canvas.width/3-75) + ",0"}, 1000, '<>',  
                function() {
                  spinner.animate(
                    {transform: "r" + winningAngle + " " + (canvas.width*2/3) + " " + 125}, 3000, '>',
                    afterSpin);
                    hand.animate({transform: "r90,T" + (canvas.width/3-120) + ",0"}, 500, '<>');
                    }
                );
            goButton.hide();
          });

              function afterSpin() {
                var winningPayoff = payoffVector[winChoice-1];
                $('#Outcome').html(winningPayoff);
                $('#Outcome2').html(winningPayoff);
                
                $("#response").show(); 
                experiment.startTime = (new Date()).getTime();
              }
    numComplete++;
    }
  }

  


};
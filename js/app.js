var thememode = false;
var editmode = false;
var contextmode = false;
var fontsize = 1;

var contextMenu = document.getElementById('context');
var device = new Object(); // TODO: Make this better

var detectDevice = function(){
  device.ipad = (/iPad/).test(navigator.userAgent);
  device.iphone = (/iPod|iPhone/).test(navigator.userAgent);
  device.android = (/Android/).test(navigator.userAgent);
  device.desktop = !(/iPad|iPhone|Android/).test(navigator.userAgent);
  if(device.ipad)    { document.body.setAttribute("data-device","ipad"); }
  if(device.iphone)  { document.body.setAttribute("data-device","iphone"); }
  if(device.android) { document.body.setAttribute("data-device","android"); }
  if(device.desktop) { document.body.setAttribute("data-device","desktop"); }
};

/* Tutorial */

var startTutorial = function(){
  document.getElementById('tutorial').setAttribute('class','active');
};
var removeTutorial = function(){
  document.getElementById('tutorial').setAttribute('class','finished');
  localStorage.setItem("tutorialCompleted",true);
  window.setTimeout("document.getElementById('tutorial').parentNode.removeChild(document.getElementById('tutorial'))",1000);
};

var resetLocalStorage = function(){
  localStorage.clear();
  alert('Database deleted');
};

/* Check if this is on Homescreen */
var checkHomescreen = function(){
  if(!window.navigator.standalone) {
    document.body.setAttribute('class','preview');
  }
};

var checkOrientation = function() {
  if(window.orientation !== undefined) {
    if(window.orientation == 0 || window.orientation == 180) {
      document.body.setAttribute('data-orientation','portrait');
    } else {
      document.body.setAttribute('data-orientation','landscape');
    }
  }
  stat(document.body.getAttribute("data-device")+' '+document.body.getAttribute("data-orientation"));
};
//TODO: Remove
var writeQuote = function() {
  if(!editmode) {
    document.getElementById('spread').innerHTML = parseTextile(quotes[Math.floor(Math.random()*quotes.length)]); // TODO: replace by random tweet
    document.body.setAttribute('class','');
    saveToLocalStorage(1);    
  }
};

/* Edit Mode */
var enterEditmode = function(){
  editmode = true;
  document.getElementById('spread').innerHTML = parseHTML(document.getElementById('spread').innerHTML);
  document.body.setAttribute('class','editmode');
  if(!session.discovered.edit) {
    session.discovered.edit = true;
    track('session.discovered.edit');
  }
};

var exitEditmode = function(){
  editmode = false;
  document.getElementById('spread').innerHTML = parseTextile(document.getElementById('spread').innerHTML);
  document.body.setAttribute('class','');
  saveToLocalStorage(1);
};

var clearSpread = function(){
  document.getElementById('spread').innerHTML = "";
  document.getElementById('spread').focus();
  saveToLocalStorage(1);
  if(!session.discovered.clearSpread) {
    session.discovered.clearSpread = true;
    track('session.discovered.clearSpread');
  }
};

var parseTextile = function(text){
  base = text.split('*');
  for(word in base) {
    if(word%2==1) {
      base[word] = '<strong>'+base[word]+'</strong>';
    }
  }
  text = base.join("");
  return text;
};

var parseHTML = function(text){
  base = (text.replace(/\<strong\>/g, '*')).replace(/\<\/strong\>/g, '*');
  return base;
};

/* Status */
var stat = function(msg) {
  document.getElementById('status').innerHTML = msg;
};

/* Position */
var setTextPosition = function(position) {
  document.getElementById('spread').setAttribute('class',position);
  if(!session.discovered.position) {
    session.discovered.position = true;
    track('session.discovered.position');
  }
  saveToLocalStorage(1);
};

/* Lineheight */
var setLineheight = function(lineheight) {
  lineHeight = startLineheight+(lineheight/300);
  if(lineHeight <= 0.01) {
    lineHeight = 0.01;
  }
  document.getElementById('spread').style.lineHeight = lineHeight;
  if(!session.discovered.lineHeight) {
    session.discovered.lineHeight = true;
    track('session.discovered.lineHeight');
  }
  saveToLocalStorage(1);
};

/* Kerning */
var setKerning = function(kerning) {
  letterSpacing = startKerning+(kerning/800);
  if(letterSpacing <= -.5) {
    letterSpacing = -.5;
  }
  document.getElementById('spread').style.letterSpacing = letterSpacing+"em";
  if(!session.discovered.kerning) {
    session.discovered.kerning = true;
    track('session.discovered.kerning');
  }
  saveToLocalStorage(1);
};

/* Font Size */
var setFontSize = function(fontsize) {
  fontsize = startFontSize*fontsize;
  if(fontsize <= 0.1) {
    fontsize = 0.1;
  }
  document.getElementById('spread').style.fontSize = fontsize+"em";
  if(!session.discovered.fontSize) {
    session.discovered.fontSize = true;
    track('session.discovered.fontSize');
  }
  saveToLocalStorage(1);
};

/* Theme Menu */
var openThemeMenu = function() {
  thememode = true;
  document.body.setAttribute('class','theme-menu');
  document.getElementById('spread').setAttribute('contenteditable',false);
  if(!session.discovered.theme) {
    session.discovered.theme = true;
    track('session.discovered.theme');
  }
};

var setThemeListWidth = function() {
  themeListWidth = document.querySelectorAll('#theme-list button').length*92;
};

/* Session Load */
if(!session.started) {
  track('session.started');
  session.started = true;
}

/* Load & Save to LocalStorage */
var loadFromLocalStorage = function(id) {
  if(localStorage.getItem(id)) {
    document.getElementById('bleed').outerHTML = b64_to_utf8(localStorage.getItem(id));
  }  
};

var saveToLocalStorage = function(id) {
  localStorage.setItem(id, utf8_to_b64(document.getElementById('bleed').outerHTML));
};
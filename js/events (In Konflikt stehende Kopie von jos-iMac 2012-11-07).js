// TODO: This stuff should go into a proper Init-function

loadFromLocalStorage(1);
//checkHomescreen();
detectDevice();
setThemeListWidth();

var spread = new Hammer(document.getElementById("spread"));
var curtain = new Hammer(document.getElementById("curtain"));

var blockEvent = false; // TODO: make this better

// TODO: this is stupid. find a good way instead of preventing focusin on spread when curtain is tapped
var unBlockEvent = function() {
  blockEvent = true;
  setTimeout(function(){
    blockEvent = false;
  },1000);
};

/* Events */

//window.addEventListener('shake', writeQuote, false);

spread.ondragstart = function(e){
  startKerning = parseFloat(document.getElementById('spread').style.letterSpacing);
  if(!startKerning || startKerning == "normal") { startKerning = 0; }
  startLineheight = parseFloat(document.getElementById('spread').style.lineHeight);
  if(!startLineheight || startLineheight == "normal") { startLineheight = 1; }
  posY = e.position.y/window.innerHeight;
};

spread.ondrag = function(e){
  if(!editmode) {
    if(e.direction == "left" || e.direction == "right") {
      setKerning(e.distanceX);
    } else {
      if(posY < .8) {
        setLineheight(e.distanceY);      
      } else {
        if(posY > .8) {
          openThemeMenu();
        }
      }
    }    
  }
};

spread.ontransformstart = function(e) {
  startFontSize = parseFloat(document.getElementById('spread').style.fontSize);
  if(!startFontSize || startFontSize == "normal") { 
    document.getElementById('spread').style.fontSize = "1em";
    startFontSize = 1;
  }
};

spread.ontransform = function(e) {
  setFontSize(e.scale);
};

spread.ondoubletap = function(e){
  posX = e.position[0].x/window.innerWidth;
  posY = e.position[0].y/window.innerHeight;
  
  if(posX > .66) {
    posX = "right";
  } else {
    if(posX < .33) {
      posX = "left";
    } else {
      posX = "center";
    }
  }
  if(posY > .66) {
    posY = "bottom";
  } else {
    if(posY < .33) {
      posY = "top";
    } else {
      posY = "middle";
    }
  }
  if(!editmode) {
    setTextPosition(posX+' '+posY);	
  } else {
    clearSpread();
  }
};


// TODO: remove this in case context menu isn't used
spread.onhold = function(e) {
  if(!editmode) {
  //  openContextmenu(e.position[0].x,e.position[0].y);
  }
};

var curtainTouch = function() {
  if(thememode) {
    document.body.setAttribute('class','');
    thememode = false;
    return false;
  }
  if(contextmode) {
    document.body.setAttribute('class','');
    contextmode = false;
    return false;
  }
};

[].forEach.call( document.querySelectorAll('#theme-list button'), function(el) {
   el.addEventListener('click', function() {
     document.getElementById('bleed').setAttribute('class',this.getAttribute('data-theme')); // TODO: put this into seperate function
     saveToLocalStorage(1);
  }, false);
});

document.getElementById('tutorial').addEventListener('click', removeTutorial, false);
document.getElementById('curtain').addEventListener('touchend', curtainTouch, false);
document.getElementById('spread').addEventListener('focusin', enterEditmode, false);
document.getElementById('spread').addEventListener('focusout', exitEditmode, false);
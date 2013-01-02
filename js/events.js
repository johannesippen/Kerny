// TODO: This stuff should go into a proper Init-function

// window.alert('status: 2012-11-07-23:23');

loadFromLocalStorage(1);
detectDevice();
checkHomescreen();
setThemeListWidth();
checkOrientation();

/* Start the Tutorial, only when: Mobile, Homescreen & localStorage empty */
if(!device.desktop && window.navigator.standalone) {
  if(!localStorage.getItem("tutorialCompleted")) {
    startTutorial();
  }
}

var spread = new Hammer(document.getElementById("spread"));
var curtain = new Hammer(document.getElementById("curtain"));

var disectStart = false;

/* Events */

window.addEventListener('shake', resetLocalStorage, false);
window.addEventListener('orientationchange', checkOrientation, false);

spread.ondragstart = function(e){
  // Preparation for Disect-Mode:
  posX = e.position.x/window.innerWidth;
  posY = e.position.y/window.innerHeight;
  if(posX > .9 && posY < .1) { disectStart = true; }
  
  startKerning = parseFloat(document.getElementById('spread').style.letterSpacing);
  if(!startKerning || startKerning == "normal") { startKerning = 0; }
  startLineheight = parseFloat(document.getElementById('spread').style.lineHeight);
  if(!startLineheight || startLineheight == "normal") { startLineheight = 1; }
  posY = e.position.y/window.innerHeight;
};

spread.ondrag = function(e){
  if(!disectStart) {
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
  }
};

spread.ondragend = function(e){
  // Preparation for Disect-Mode:
  posX = e.touches[0].x/window.innerWidth;
  posY = e.touches[0].y/window.innerHeight;

  /* if(posX < .33 && posY > .66) {  
    alert("Disect Mode FTW!");
  } */
  disectStart = false;
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

var curtainTouch = function() {
  if(thememode) {
    document.body.setAttribute('class','');
    thememode = false;
    window.setTimeout("document.getElementById('spread').setAttribute('contenteditable','true');",500); // TODO: This is stupid - maybe find a way to not delegate the tap event to the underlying #spread?
    return false;
  }
  if(contextmode) {
    document.body.setAttribute('class','');
    contextmode = false;
    return false;
  }
};

[].forEach.call( document.querySelectorAll('#theme-list button.theme'), function(el) {
   el.addEventListener('click', function() {
     document.getElementById('bleed').setAttribute('class',this.getAttribute('data-theme')); // TODO: put this into seperate function
     saveToLocalStorage(1);
  }, false);
});

document.querySelector('.share button').addEventListener('click', exportHTML, false);
document.getElementById('tutorial').addEventListener('click', removeTutorial, false);
document.getElementById('curtain').addEventListener('touchend', curtainTouch, false);
document.getElementById('spread').addEventListener('focusin', enterEditmode, false);
document.getElementById('spread').addEventListener('focusout', exitEditmode, false);

document.getElementById('exiteditmode').addEventListener('touchend', androidSelect, false);

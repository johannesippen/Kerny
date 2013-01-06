var session = new Object();
    session.discovered = new Object();
    
    session.started = false;
    
    session.discovered.kerning = false;
    session.discovered.lineHeight = false;
    session.discovered.fontSize = false;
    session.discovered.position = false;
    session.discovered.theme = false;
    session.discovered.edit = false;
    session.discovered.clearSpread = false;
    session.discovered.exportHTML = false;
    session.discovered.deviceOrientation = false;
    
var track = function(event) {
  _gaq.push(['_trackEvent', 'session', event]);
};
var utf8_to_b64 = function(str) {
  return (window.btoa(unescape(encodeURIComponent(str)))).replace(/\+/g, '-').replace(/\//g, '_');
};

var b64_to_utf8 = function(str) {
  return (decodeURIComponent(escape(window.atob(str.replace(/-/g, '+').replace(/_/g, '/')))));
};

var getText = function() {
  return document.getElementById('spread').innerText.replace(/\*/g,'');
};

var generateMail = function(url){
  bodyText = "Here is your Design -> " + url + "%0A%0AThis was made in Rouse and exported to HTML. %0A%0AWant to export to PDF, Illustrator and PNG? Learn more: http://www.asidemag.com/%0AWant to do your own designs with Rouse? Get Rouse for free on http://asidemag.com/rouse/";
  window.location.href = "mailto:?subject=" + getText() + "&body="+bodyText;
};

var shortenURL = function(longUrl) {
  // TODO: replace this with JSONP request
  var xhr = new XMLHttpRequest();
  // TODO: replace Login Data with rouse-specific
  xhr.open("GET", "http://api.bitly.com/v3/shorten?apiKey=R_7524bb47dd811378b1c94f14d252a990&login=jippen&longUrl="+longUrl);
  xhr.onreadystatechange = function() { 
      if(xhr.readyState == 4) { 
          if(xhr.status==200) {
              response = JSON.parse(xhr.response);
              generateMail(response.data.url);
          } else {
              generateMail(longUrl);
          }
      } 
  };
  xhr.send();
};

/* Import HTML */
var importHTML = function(base64) {
  document.getElementById('bleed').outerHTML = b64_to_utf8(base64);
  document.getElementById('spread').setAttribute('contenteditable',false);
};

/* Export HTML */
var exportHTML = function() {
  html = utf8_to_b64(document.getElementById('bleed').outerHTML);
  url = window.location.protocol + "//" + window.location.host + window.location.pathname + "v/?" + html;
  shortenURL(url);
  if(!session.discovered.exportHTML) {
    session.discovered.exportHTML = true;
    track('session.discovered.exportHTML');
  }
};
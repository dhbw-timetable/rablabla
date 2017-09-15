// = = Gets called on document loaded = =
// https://stackoverflow.com/questions/4723213/detect-http-or-https-then-force-https-in-javascript
if (location.protocol != 'https:') location.href = 'https:' + window.location.href.substring(window.location.protocol.length);

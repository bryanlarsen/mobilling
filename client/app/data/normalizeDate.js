module.exports = function(s, today) {
  var re = /^([0-9]{0,4}?)[.,:\/-]?([0-9]{0,2}?)[.,:\/-]?([0-9]{0,2})$/;
  var match = s.match(re);
  if (!today) today = new Date();
  var zf = function(s, l) { return ('00' + s).slice(-(l||2)); };
  if (!match) {
    return zf(today.getFullYear(),4)+'-'+zf(today.getMonth()+1)+'-'+zf(today.getDate());
  }
  var y = parseInt(match[1] || today.getFullYear());
  if (y < today.getFullYear()-2000) y=y+2000;
  if (y < 999) y=y+1900;
  var m = parseInt(match[2] || (today.getMonth()+1));
  var d = parseInt(match[3] || today.getDate());
  var date = new Date(y,m-1,d); // round trip to validate
  return zf(date.getFullYear(),4)+'-'+zf(date.getMonth()+1)+'-'+zf(date.getDate());
};


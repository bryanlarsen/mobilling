import _ from 'underscore';
import serviceCodesEngine from '../data/serviceCodesEngine';

var FeeGenerator = function(codes) {
  this.service_codes = codes;
}

FeeGenerator.inMinutes = function(time) {
  var split = time.split(':');
  return parseInt(split[0], 10) * 60 + parseInt(split[1], 10);
};

FeeGenerator.prototype.overtimeRate = function(code) {
  return {
    'E400B': 0.5,
    'E401B': 0.75,
    'E400C': 0.5,
    'E401C': 0.75,
    'E082A': 0.3,
    'E083A': 0.3,
    'E676A': 0.25
  }[code];
};

FeeGenerator.prototype.normalizeCode = function(value) {
  if (typeof value !== 'string') {
    return null;
  }
  var code = value.toUpperCase().match(/^[A-Z]\d\d\d[A-C]/);
  if (code) {
    return code[0];
  } else if (!code) {
    code = value.toUpperCase().match(/^[A-Z]\d\d\d/);
    if (code) return code[0]+'A';
  }
  return null;
}

FeeGenerator.prototype.validateCode = function(code) {
  return this.service_codes[this.normalizeCode(code)] ? false : ['not found'];
}

FeeGenerator.prototype.needsDiagnosis = function(code) {
  var sc = this.service_codes[this.normalizeCode(code)];
  if (!sc) return null;
  return sc.rdc;
}

/* calculate the fee for a single line.  Date, time_in, time_out are
 * taken from detail, but code is passed in.   That way the same code
 * is used to calculate for both main lines and premiums
 */
FeeGenerator.prototype.calculateFee = function(detail, code) {
  code = this.normalizeCode(code);
  var service_code = this.service_codes[code];
  if (!service_code) return null;

  var overtime = this.overtimeRate(code);
  if (overtime) {
    return {
      fee: Math.round(detail.fee * overtime),
      units: detail.units
    }
  }

  var unit_fee = service_code.fee, border1 = 0, border2 = 0;
  var units, fee;

  // valid as of September 1, 2011.   Adjust based on detail.day when it changes
  if (code[4] === 'B') {
    unit_fee = 1204;
    border1 = 60;
    border2 = 150;
  } else if (code[4] === 'C') {
    unit_fee = 1501;
    border1 = 60;
    border2 = 90;
  }

  var minutes = 0;
  if (code === this.normalizeCode(detail.code) && detail.time_in && detail.time_out) {
    minutes = FeeGenerator.inMinutes(detail.time_out) - FeeGenerator.inMinutes(detail.time_in);
    if (minutes < 0) minutes = minutes + 24*60;
  }

  if (code[4] !== 'A' && service_code.fee % unit_fee === 0) {
    units = Math.ceil(Math.min(minutes, border1) / 15);
    if (minutes > border1) {
      units = units + Math.ceil(Math.min(minutes - border1, border2 - border1) / 15.0) * 2;
    }
    if (minutes > border2) {
      units = units + Math.ceil((minutes - border2) / 15.0) * 3;
    }

    units += service_code.fee / unit_fee;
    fee = units * unit_fee;
  } else {
    fee = service_code.fee;
    units = 1;
  }

  return {
    fee: fee,
    units: units
  };
};

var feeGenerator = null;

var loadServiceCodes = function(data) {
  var array = new Array(_.size(data));
  var hash = {};
  _.each(data, function(sc, i) {
    hash[sc.code] = sc;
    array[i] = sc.name;
  });
  serviceCodesEngine.add(array);
  feeGenerator = new FeeGenerator(hash);
}

setTimeout(function() {
  if (!feeGenerator) {
      $.ajax({
        url: window.ENV.API_ROOT+'v1/service_codes.json',
        dataType: 'json',
        success: loadServiceCodes,
        error: function(xhr, status, err) {
          console.error('failed to load service codes');
          reject(Error('failed to load service codes'));
        }
      });
  }
}, 1500);

export default {
  feeGenerator,
  inMinutes: FeeGenerator.inMinutes,
}

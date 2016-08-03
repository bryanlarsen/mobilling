import _ from 'underscore';
import loadServiceCodes from './loadServiceCodes';

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

var gp37codes = [
'K002A', 'K003A', 'K005A', 'K006A', 'K007A', 'K008A',
'K013A', 'K014A', 'K015A', 'K016A',
'K022A', 'K023A', 'K028A', 'K029A',
'K033A', 'K037A',
'K040A', 'K041A', 'K044A',
'K122A', 'K123A',
'K190A', 'K191A', 'K192A', 'K193A', 'K194A', 'K195A', 'K196A', 'K197A', 'K198A', 'K199A',
'K200A', 'K201A', 'K202A', 'K203A', 'K204A', 'K205A', 'K206A', 'K207A', 'K208A', 'K209A',
'K210A', 'K211A',
'K222A',
'K620A', 'K680A',
'K887A', 'K888A', 'K889A',
];

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

FeeGenerator.prototype.baseFee = function(code) {
  code = this.normalizeCode(code);
  var service_code = this.service_codes[code];
  if (!service_code) return 0;
  return service_code.fee;
}

var simpleAlgo = function(service_code, minutes) {
  return {
    units: 1,
    fee: service_code.fee
  };
}

var assistantAlgo = function(service_code, minutes) {
  var units;
  var unit_fee = 1204;
  var border1 = 60;
  var border2 = 150;

  if (service_code.fee % unit_fee !== 0) return simpleAlgo(service_code, minutes);

  units = Math.ceil(Math.min(minutes, border1) / 15);
  if (minutes > border1) {
    units = units + Math.ceil(Math.min(minutes - border1, border2 - border1) / 15.0) * 2;
  }
  if (minutes > border2) {
    units = units + Math.ceil((minutes - border2) / 15.0) * 3;
  }
  units += service_code.fee / unit_fee;
  return {
    units: units,
    fee: units * unit_fee
  };
}

var anaesthetistAlgo = function(service_code, minutes) {
  var units;
  var unit_fee = 1501;
  var border1 = 60;
  var border2 = 90;

  if (service_code.fee % unit_fee !== 0) return simpleAlgo(service_code, minutes);

  units = Math.ceil(Math.min(minutes, border1) / 15);
  if (minutes > border1) {
    units = units + Math.ceil(Math.min(minutes - border1, border2 - border1) / 15.0) * 2;
  }
  if (minutes > border2) {
    units = units + Math.ceil((minutes - border2) / 15.0) * 3;
  }
  units += service_code.fee / unit_fee;
  return {
    units: units,
    fee: units * unit_fee
  };
}

var gp37algo = function(service_code, minutes) {
  var units = Math.floor((minutes + 14) / 30);
  return {
    units: units,
    fee: service_code.fee * units
  };
}

var k121algo = function(service_code, minutes) {
  var units = Math.min(Math.floor((minutes + 4) / 10), 8);
  return {
    units: units,
    fee: service_code.fee * units
  };
}

/* calculate the fee for a single line.  Date, time_in, time_out are
 * taken from detail, but code is passed in.   That way the same code
 * is used to calculate for both main lines and premiums
 */
FeeGenerator.prototype.calculateFee = function(detail, row0, code) {
  code = this.normalizeCode(code);
  var service_code = this.service_codes[code];

  if (!service_code) return null;

  var overtime = this.overtimeRate(code);
  if (overtime) {
    return {
      fee: Math.round(row0.fee * overtime),
      units: row0.units
    };
  }

  var minutes = 0;
  if (code === this.normalizeCode(row0.code) && detail.time_in && detail.time_out) {
    minutes = FeeGenerator.inMinutes(detail.time_out) - FeeGenerator.inMinutes(detail.time_in);
    if (minutes < 0) minutes = minutes + 24*60;
  }

  if (code[4] === 'B') return assistantAlgo(service_code, minutes);
  if (code[4] === 'C') return anaesthetistAlgo(service_code, minutes);
  if (gp37codes.indexOf(code) !== -1) return gp37algo(service_code, minutes);
  if (['K121A', 'K706A', 'K124A', 'K707A', 'K703A', 'K702A', 'K704A'].indexOf(code) !== -1) return k121algo(service_code, minutes);
  return simpleAlgo(service_code, minutes);
};

var exports = {
  feeGenerator: null,
  inMinutes: FeeGenerator.inMinutes,
  FeeGenerator
};

loadServiceCodes(function(data) {
  var hash = {};
  _.each(data, function(sc, i) {
    hash[sc.code] = sc;
  });
  exports.feeGenerator = new FeeGenerator(hash);
});

module.exports = exports;

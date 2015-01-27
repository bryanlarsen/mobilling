//= require typeahead.js/dist/typeahead.bundle
//= require components/service-codes-engine.js
//= require components/fee-generator.js

describe("fee generator", function() {
  this.timeout(10000);
  var generator;

  before(function() {
    var codes = {};
    var data = [ ['R441B',  9632],
                 ['R441A', 61990],
                 ['R441C', 12008],
                 ['E676B',  7224],
                 ['C998B',  6000],
                 ['E401B',   604],
                 ['P018A', 57980],
                 ['P018B',  7224],
               ];
    data.forEach(function(a) {
        codes[a[0]] = { code: a[0], name: a[0], fee: a[1] };
    });
    generator = new FeeGenerator(codes);
  });

  it("normalizes codes", function() {
    ['R441A', 'r441a', 'r441', 'r441a total hip', 'r441 total hip']
      .forEach(function (code) {
        expect(generator.normalizeCode(code)).to.equal('R441A');
        expect(generator.validateCode(code)).to.equal(false);
      });

    [' R441A', '441', '']
      .forEach(function (code) {
        expect(generator.normalizeCode(code)).to.equal(null);
        expect(generator.validateCode(code)[0]).to.equal('not found');
      });
  });

  it("generates codes correctly", function() {
        var data = [['R441B', '10:00', '10:00',  8,   9632],
                    ['E676B', '10:00', '10:00',  6,   7224],
                    ['R441A', '10:00', '10:00',  1,  61990],
                    ['R441A', '10:00', '13:00',  1,  61990],
                    ['R441A',    null,    null,  1,  61990],
                    ['R441C', '10:00', '10:00',  8,  12008],
                    ['R441B', '10:00', '10:01',  9,  10836],
                    ['R441B', '10:00', '10:15',  9,  10836],
                    ['R441B', '10:00', '10:16', 10,  12040],
                    ['R441B', '09:00', '10:00', 12,  14448],
                    ['R441B', '10:00', '11:00', 12,  14448],
                    ['R441B', '10:00', '11:01', 14,  16856],
                    ['R441B', '10:00', '12:30', 24,  28896],
                    ['R441B', '10:00', '12:31', 27,  32508],
                    ['R441B', '22:00', '00:31', 27,  32508],
                    ['R441B', '10:00', '14:59', 54,  65016],
                    ['C998B', '10:00', '10:00',  1,   6000],
                    ['C998B', '10:00', '13:00',  1,   6000],
                    ['C998B',    null,    null,  1,   6000],
                    ['R441C', '10:00', '10:01',  9,  13509],
                    ['R441C', '10:00', '10:15',  9,  13509],
                    ['R441C', '10:00', '10:16', 10,  15010],
                    ['R441C', '10:00', '11:00', 12,  18012],
                    ['R441C', '10:00', '11:01', 14,  21014],
                    ['R441C', '10:00', '11:30', 16,  24016],
                    ['R441C', '10:00', '11:31', 19,  28519],
                    ['R441C', '10:00', '14:59', 58,  87058]];

    data.forEach(function(d) {
      var result = generator.calculateFee({
        day: '2014-09-18',
        code: d[0],
        time_in: d[1],
        time_out: d[2],
      }, d[0]);
      expect(result.units).to.equal(d[3]);
      expect(result.fee).to.equal(d[4]);
    });
  });

  it("calculates overtime correctly", function() {
    var detail = { day: '2009-09-19', code: 'R441B', time_in: '03:00', time_out: '03:30', premiums: [ { code: 'E401B' } ] };

    var result = generator.calculateFee(detail, 'R441B');
    expect(result.fee).to.equal(12040);
    expect(result.units).to.equal(10);

    detail.fee = result.fee;
    detail.units = result.units;

    result = generator.calculateFee(detail, 'E401B');
    expect(result.fee).to.equal(12040 * 0.75);
    expect(result.units).to.equal(10);

    result = generator.calculateFee(detail, 'E401B');
    expect(result.fee).to.equal(12040 * 0.75);
    expect(result.units).to.equal(10);

    result = generator.calculateFee(detail, 'Z999C');
    expect(result).to.not.exist;
  });

});


//= require typeahead.js/dist/typeahead.bundle
//= require components/service-codes-engine.js
//= require components/fee-generator.js

import _ from 'underscore';
import service_codes from './service_codes.json';
import { FeeGenerator } from '../app/data/FeeGenerator';
var expect = chai.expect;

describe('fee generator', function() {
  this.timeout(10000);
  var generator;

  before(function() {
    var hash = {};
    _.each(service_codes, function(sc, i) {
      hash[sc.code] = sc;
    });
    generator = new FeeGenerator(hash);
  });

  it('normalizes codes', function() {
    ['R441A', 'r441a', 'r441', 'r441a total hip', 'r441 total hip'].forEach(
      function(code) {
        expect(generator.normalizeCode(code)).to.equal('R441A');
        expect(generator.validateCode(code)).to.equal(false);
      }
    );

    [' R441A', '441', ''].forEach(function(code) {
      expect(generator.normalizeCode(code)).to.equal(null);
      expect(generator.validateCode(code)[0]).to.equal('not found');
    });
  });

  it('generates codes correctly', function() {
    var data = [
      ['R441B', '10:00', '10:00', 8, 9632],
      ['E676B', '10:00', '10:00', 6, 7224],
      ['R441A', '10:00', '10:00', 1, 61990],
      ['R441A', '10:00', '13:00', 1, 61990],
      ['R441A', null, null, 1, 61990],
      ['R441C', '10:00', '10:00', 8, 12008],
      ['R441B', '10:00', '10:01', 9, 10836],
      ['R441B', '10:00', '10:15', 9, 10836],
      ['R441B', '10:00', '10:16', 10, 12040],
      ['R441B', '09:00', '10:00', 12, 14448],
      ['R441B', '10:00', '11:00', 12, 14448],
      ['R441B', '10:00', '11:01', 14, 16856],
      ['R441B', '10:00', '12:30', 24, 28896],
      ['R441B', '10:00', '12:31', 27, 32508],
      ['R441B', '22:00', '00:31', 27, 32508],
      ['R441B', '10:00', '14:59', 54, 65016],
      ['C998B', '10:00', '10:00', 1, 6000],
      ['C998B', '10:00', '13:00', 1, 6000],
      ['C998B', null, null, 1, 6000],
      ['R441C', '10:00', '10:01', 9, 13509],
      ['R441C', '10:00', '10:15', 9, 13509],
      ['R441C', '10:00', '10:16', 10, 15010],
      ['R441C', '10:00', '11:00', 12, 18012],
      ['R441C', '10:00', '11:01', 14, 21014],
      ['R441C', '10:00', '11:30', 16, 24016],
      ['R441C', '10:00', '11:31', 19, 28519],
      ['R441C', '10:00', '14:59', 58, 87058],
      ['K002A', '10:00', '10:20', 1, 6275],
      ['K003A', '10:00', '10:45', 1, 6275],
      ['K008A', '10:00', '10:46', 2, 12550],
      ['K002A', '10:00', '12:15', 4, 25100],
      ['K003A', '10:00', '12:16', 5, 31375],
      ['K121A', '10:00', '10:10', 1, 3135],
      ['K706A', '10:00', '10:15', 1, 3135],
      ['K124A', '10:00', '10:16', 2, 6270],
      ['K707A', '10:00', '11:05', 6, 18810],
      ['K704A', '10:00', '11:06', 7, 21945],
      ['K121A', '10:00', '19:00', 8, 25080],
      ['H409A', '10:00', '11:00', 1, 17000],
      ['H409A', '10:00', '12:00', 2, 34000],
    ];

    data.forEach(function(d) {
      var detail = {
        day: '2014-09-18',
        rows: [{ code: d[0] }],
        time_in: d[1],
        time_out: d[2],
      };
      var result = generator.calculateFee(detail, detail.rows[0], d[0]);
      console.log('from', d, 'calculated', result);
      expect(result.units).to.equal(d[3]);
      expect(result.fee).to.equal(d[4]);
    });
  });

  it('calculates overtime correctly', function() {
    var detail = {
      day: '2009-09-19',
      rows: [{ code: 'R441B' }, { code: 'E401B' }],
      time_in: '03:00',
      time_out: '03:30',
    };

    var result = generator.calculateFee(detail, detail.rows[0], 'R441B');
    expect(result.fee).to.equal(12040);
    expect(result.units).to.equal(10);

    detail.rows[0].fee = result.fee;
    detail.rows[0].units = result.units;

    result = generator.calculateFee(detail, detail.rows[0], 'E401B');
    expect(result.fee).to.equal(12040 * 0.75);
    expect(result.units).to.equal(10);

    result = generator.calculateFee(detail, detail.rows[0], 'C998B');
    expect(result.fee).to.equal(6000);
    expect(result.units).to.equal(1);

    result = generator.calculateFee(detail, detail.rows[0], 'E676B');
    expect(result.fee).to.equal(1204 * 6);
    expect(result.units).to.equal(6);

    result = generator.calculateFee(detail, detail.rows[0], 'Z999C');
    expect(result).to.not.exist;
  });
});

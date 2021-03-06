import detailsGenerator from '../app/data/detailsGenerator';
import {detailSignature, detailsToAdd, detailsToRemove} from '../app/data/detailsDelta';

describe("details delta", function() {
  var A, Asig, B, Bsig, C, Csig, D, Dsig;

  beforeEach(function() {
    A = { day: "2014-06-09", rows: [{ code: "A135A"}, {code: "E082A" }], time_in: null, time_out: null };
    Asig = '2014-06-09;;;A135A,E082A';
    B = { day: "2014-06-09", rows: [{ code: "B135A"}, {code: "E082A" }], time_in: null, time_out: null };
    Bsig = '2014-06-09;;;B135A,E082A';
    C = { day: "2014-06-10", rows: [{ code: "A135A"}, {code: "E082A" }], time_in: null, time_out: null };
    Csig = '2014-06-10;;;A135A,E082A';
    D = { day: "2014-06-10", rows: [{code: "A135A"} ], time_in: null, time_out: null };
    Dsig = '2014-06-10;;;A135A';
  });

  it("returns something", function() {
    expect(detailSignature(A)).toEqual(Asig);
  });

  it("normalizes code", function() {
    A.rows[0].code = "a135a foo";
    A.rows[1].code = "E082a bar";
    expect(detailSignature(A)).toEqual(Asig);
  });

  it("ignores fee, units", function() {
    A.fee = 10000;
    A.units = 12;
    expect(detailSignature(A)).toEqual(Asig);
  });

  it("adds new elements", function() {
    // virgin
    expect(detailsToAdd([], [Asig], [])).toEqual([0]);
    // next run adds B
    expect(detailsToAdd([Asig], [Asig, Bsig], [Asig])).toEqual([1]);
    // user changes A to C, rerun adds A back
    expect(detailsToAdd([Csig, Bsig], [Asig, Bsig], [Asig, Bsig])).toEqual([0]);
    // order doesn't matter
    expect(detailsToAdd([Csig, Bsig, Asig], [Asig, Bsig], [Asig, Bsig])).toEqual([]);
  });

  it("removes elements", function() {
    // remove both gen'd, leave manual
    expect(detailsToRemove([Csig, Bsig, Asig], [], [Asig, Bsig])).toEqual([2, 1]);
    // remove one gen'd
    expect(detailsToRemove([Csig, Bsig, Asig], [Asig], [Asig, Bsig])).toEqual([1]);
    // remove both gen'd, leave manual which is same as new gen'd
    expect(detailsToRemove([Csig, Bsig, Asig], [Csig], [Asig, Bsig])).toEqual([2, 1]);
    // user manually removed already
    expect(detailsToRemove([Csig, Bsig], [], [Asig])).toEqual([]);
  });

  it("transforms elements", function() {
    expect(detailsToAdd([Csig], [Dsig], [Csig])).toEqual([0]);
    expect(detailsToRemove([Csig], [Dsig], [Csig])).toEqual([0]);
  });
});

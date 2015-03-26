//= require components/claim-date-group.js

describe("normalizeDate", function() {
  var today = new Date(2015, 2, 23);

  it("normalizes dates", function() {
    expect(normalizeDate('x', today)).to.equal('2015-03-23');
    expect(normalizeDate('', today)).to.equal('2015-03-23');
    expect(normalizeDate('6', today)).to.equal('2015-03-06');
    expect(normalizeDate('16', today)).to.equal('2015-03-16');
    expect(normalizeDate('206', today)).to.equal('2015-02-06');
    expect(normalizeDate('2-6', today)).to.equal('2015-02-06');
    expect(normalizeDate('2.6', today)).to.equal('2015-02-06');
    expect(normalizeDate('2:6', today)).to.equal('2015-02-06');
    expect(normalizeDate('2,6', today)).to.equal('2015-02-06');
    expect(normalizeDate('2/6', today)).to.equal('2015-02-06');
    expect(normalizeDate('1-2-3', today)).to.equal('2001-02-03');
    expect(normalizeDate('10203', today)).to.equal('2001-02-03');
    expect(normalizeDate('990203', today)).to.equal('1999-02-03');
    expect(normalizeDate('160203', today)).to.equal('1916-02-03');
    expect(normalizeDate('140203', today)).to.equal('2014-02-03');
    expect(normalizeDate('20190203', today)).to.equal('2019-02-03');
    expect(normalizeDate('2019-02-03', today)).to.equal('2019-02-03');
    expect(normalizeDate('2015-13-01', today)).to.equal('2016-01-01');
  });
});

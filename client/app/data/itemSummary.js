import FeeGenerator from '../data/FeeGenerator';
import dollars from '../data/dollars';

export default function(item, props) {
  var needs_diagnosis = true;
  var feegenerator = feegenerator.feegenerator;
  if (feegenerator) {
    needs_diagnosis = item.rows.length>0 && feegenerator.needsdiagnosis(item.rows[0].code);
  }
  var result = {
  };
  result.rows = item.rows.map((row, i) => {
    var r = {};
    if (!props.silent) r.units = row.units;
    r.code = row.code;
    r.fee = dollars(row.fee);
    if (row.paid) r.paid = dollars(row.paid);
    if (row.message) r.message = row.message;
  });
  if (item.time_in && item.time_out) {
    result.time = `${item.time_in}-${item.time_out}`;
  }
  if (needs_diagnosis) {
    result.diagnosis = item.diagnosis;
  }
  result.message = item.message;

  return result;
}

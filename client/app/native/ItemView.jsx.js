import React, {View, Text, StyleSheet} from 'react-native';
import Button from './react-native-custom-action-sheet/button.js';
import FeeGenerator from '../data/FeeGenerator';
import dollars from '../data/dollars';

var styles = StyleSheet.create({
  row: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', left:0, right:0},
  part: {flex: 1},
});

export default class ItemView extends React.Component {
  render() {
    var needs_diagnosis = true;
    var feeGenerator = FeeGenerator.feeGenerator;
    if (feeGenerator) {
      needs_diagnosis = this.props.store.rows.length>0 && feeGenerator.needsDiagnosis(this.props.store.rows[0].code);
    }
    return (
      <View onPress={this.props.expand}>
        <Text style={styles.part}>{this.props.store.message}</Text>
        { this.props.store.rows.map((row, i) => {
          return (
              <View style={styles.row} key={'row-'+i}>
              <View style={styles.row} >
                {!this.props.silent && <Text style={styles.part}>{row.units}x </Text>}
                <Text style={styles.part}>{row.code}</Text>
                <Text style={styles.part}>{dollars(row.fee)}</Text>
              {row.paid && <Text style={styles.part}>{dollars(row.paid)+'/'}</Text>}
            </View>
            <View>

              <Text style={styles.part}>{row.message}</Text>
            </View>
            </View>
          );
        })
        }
        <View style={styles.row} >
          <Text style={styles.part}>{this.props.store.time_in}-{this.props.store.time_out}</Text>
          {needs_diagnosis && <Text style={styles.part}> {this.props.store.diagnosis}</Text>}
        </View>
      </View>
    );
  }
};

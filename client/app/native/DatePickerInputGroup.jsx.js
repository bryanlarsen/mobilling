import s from 'underscore.string';
import _ from 'underscore';
import moment from 'moment';
import React, {View, DatePickerIOS, TouchableOpacity, Text} from 'react-native';
import styles from './styles';
import LabelledControl from './LabelledControl.jsx';
import InputWarnings from './InputWarnings.jsx';
import CustomActionSheet from './react-native-custom-action-sheet';

export default class DatePickerInputGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  focus() {
    this.setState({open: true});
  }

  render() {
    const value = this.props.value !== undefined ? this.props.value : this.props.store[this.props.name];
    return <View>
      <LabelledControl label={this.props.label || s.humanize(this.props.name)}>
        <TouchableOpacity onPress={() => this.setState({open: true})}>
          <Text style={styles.valueText}>{value}</Text>
        </TouchableOpacity>
      </LabelledControl>
      <CustomActionSheet modalVisible={this.state.open} onCancel={() => this.setState({open: false})} buttonText="OK">
        <View style={styles.container}>
          <DatePickerIOS date={moment(value, "YYYY-MM-DD").toDate()} mode="date"  onDateChange={(date) => {
              this.props.onUpdate({[this.props.name]: moment(date).format("YYYY-MM-DD")});
            }} />
        </View>
      </CustomActionSheet>
      <InputWarnings {...this.props} />
    </View>;
  }
};

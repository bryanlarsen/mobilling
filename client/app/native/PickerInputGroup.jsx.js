import s from 'underscore.string';
import _ from 'underscore';
import React, {View, PickerIOS, TouchableOpacity, Text} from 'react-native';
const PickerItem = PickerIOS.Item;
import styles from './styles';
import LabelledControl from './LabelledControl.jsx';
import InputWarnings from './InputWarnings.jsx';
import CustomActionSheet from './react-native-custom-action-sheet';

export default class PickerInputGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  focus() {
    this.setState({open: true});
  }

  render() {
    const code = this.props.value !== undefined ? this.props.value : this.props.store[this.props.name];
    const value = this.props.options[code] || code;
    return <View>
      <LabelledControl label={this.props.label || s.humanize(this.props.name)}>
        <TouchableOpacity onPress={() => this.setState({open: true})}>
          <Text style={styles.valueText}>{value}</Text>
        </TouchableOpacity>
      </LabelledControl>
      <CustomActionSheet modalVisible={this.state.open} onCancel={() => this.setState({open: false})}>
        <View style={styles.container}>
          <PickerIOS selectedValue={code} onValueChange={(code) => {
              this.setState({open: false});
              this.props.onUpdate({[this.props.name]: code});
            }}>
            {_.map(this.props.options, (value, code) => <PickerItem
                                                          key={code} value={code} label={value}
                                                        /> )}
          </PickerIOS>
        </View>
      </CustomActionSheet>
      <InputWarnings {...this.props} />
    </View>;
  }
};

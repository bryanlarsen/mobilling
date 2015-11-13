import s from 'underscore.string';
import _ from 'underscore';
import React, {View, Text, SegmentedControlIOS} from 'react-native';
import styles from './styles';
import LabelledControl from './LabelledControl.jsx';
import InputWarnings from './InputWarnings.jsx';

export default class SegmentedInputGroup extends React.Component {
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
        <SegmentedControlIOS
          values={_.values(this.props.options)}
          selectedIndex={_.keys(this.props.options).indexOf(value)}
          onValueChange={(val) => this.props.onUpdate({[this.props.name]: _.keys(this.props.options)[_.values(this.props.options).indexOf(val)]})}
        />
      </LabelledControl>
      <InputWarnings {...this.props} />
    </View>;
  }
};

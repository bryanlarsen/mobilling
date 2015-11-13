import _ from 'underscore';
import React, {Text} from 'react-native';
import styles from './styles';

export default class InputWarnings extends React.Component {
  render() {
    if (this.props.silent) return false;
    let messages = [];
    let types = {};

    if (this.props.store) {
      for (const type of ['warnings', 'errors', 'validations']) {
        const m = this.props.store[type] && this.props.store[type][this.props.name];
        if (m) {
          messages.push(m);
          types[type] = true;
        }
      }
    }

    return <Text style={styles.error}>
      {_.flatten(messages).join(', ')}
    </Text>;
  }
}


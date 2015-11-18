import React, {View, Text} from 'react-native';
import Button from './react-native-custom-action-sheet/button.js';

export default class ItemView extends React.Component {
  render() {
    return <Button text={this.props.item.id} />;
  }
};

import s from 'underscore.string';
import _ from 'underscore';
import React, {View, TouchableOpacity, Text} from 'react-native';
import Autocomplete from 'react-native-autocomplete';
import styles from './styles';
import LabelledControl from './LabelledControl.jsx';
import InputWarnings from './InputWarnings.jsx';

export default class AutocompleteInputGroup extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value !== undefined ? props.value : props.store[this.props.name];
    this.state = {data: [value], focused: false, value};
  }

  onTyping(text) {
    var suggestions = this.props.suggestions.filter(function (suggestion) {
      return suggestion.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });
    console.log('ontyping', text, suggestions, this.state.focused);
    this.setState({
      value: text,
      data: suggestions
    });
  }

  render() {
    return <View style={{height: this.state.focused ? 500 : 65}}>
      <Autocomplete
        placeholder={this.props.label || s.humanize(this.props.name)}
    suggestions={this.state.data}
    defaultValue={this.state.value}
             onTyping={this.onTyping.bind(this)}
    returnKeyType="next"
    clearTextOnFocus={true}
    style={[styles.autocomplete, {height: 45}]}
    onFocus={() => this.setState({focused: true})}
    onSelect={(value) => this.setState({value})}
    onBlur={() => {
      this.setState({focused: false});
      this.props.onUpdate({[this.props.name]: this.state.value});
    }}
    />
      <InputWarnings {...this.props} />
    </View>;
  }
};

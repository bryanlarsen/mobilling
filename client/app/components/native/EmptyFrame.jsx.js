'use strict';

var React = require('react-native');
var {Text, View, Component} = React;
const styles = require('./styles');

class EmptyFrame extends Component{
  render() {
    return <View style={styles.toolbar}>
      <Text style={styles.toolbarTitle}>Empty</Text>
      </View>;
  }
}

module.exports = EmptyFrame;


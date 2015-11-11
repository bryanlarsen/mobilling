'use strict';

var React = require('react-native');
var {Text, View, Component, TouchableOpacity} = React;
const styles = require('./styles');

class Toolbar extends Component{
  render() {
    return <View style={styles.toolbar}>
      {this.props.left &&
       <TouchableOpacity onPress={this.props.onPressLeft}>
         <Text style={styles.toolbarButton}>{this.props.left}</Text>
       </TouchableOpacity>
      }
      <Text style={styles.toolbarTitle}>{this.props.title}</Text>
      {this.props.right &&
       <TouchableOpacity onPress={this.props.onPressRight}>
         <Text style={styles.toolbarButton}>{this.props.right}</Text>
       </TouchableOpacity>
      }
    </View>;
  }
}

module.exports = Toolbar;

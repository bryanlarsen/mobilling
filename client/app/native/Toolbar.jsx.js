'use strict';

var React = require('react-native');
var {Text, View, Component, TouchableOpacity} = React;
const styles = require('./styles');

class Toolbar extends Component{

  handlePressLeft() {
    this.props.actions.pushState(null, this.props.left.route.path, this.props.left.route.params);
  }

  handlePressRight() {
    this.props.actions.pushState(null, this.props.right.route.path, this.props.right.route.params);
  }

  render() {
    return <View style={styles.toolbar}>
      {this.props.left &&
       <TouchableOpacity onPress={this.handlePressLeft.bind(this)}>
         <Text style={styles.toolbarButton}>{this.props.left.text}</Text>
       </TouchableOpacity>
      }
      <Text style={styles.toolbarTitle}>{this.props.title}</Text>
      {this.props.right &&
       <TouchableOpacity onPress={this.handlePressRight.bind(this)}>
         <Text style={styles.toolbarButton}>{this.props.right.text}</Text>
       </TouchableOpacity>
      }
    </View>;
  }
}

module.exports = Toolbar;

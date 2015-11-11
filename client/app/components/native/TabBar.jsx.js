'use strict';

var React = require('react-native');
var _ = require('underscore');
var {Text, View, Component, TouchableOpacity} = React;
const styles = require('./styles');

class TabBar extends Component{
  componentWillMount() {
    this.props.actions.refreshClaim(this.props.claimId);
  }

  handlePress(action) {
    var paths = this.props.nativeRouter.route.path.split('/');
    paths[3] = action;
    this.props.actions.pushState(null, paths.join('/'));
  }

  render() {
    return <View style={styles.tabbar}>
      {_.map(['patient', 'claim', 'consult', 'items', 'comment'], (action) => {
        return <TouchableOpacity key={action} style={styles.tabButton} onPress={this.handlePress.bind(this, action)}>
          <Text style={this.props.active === action ? styles.activeItem : styles.inactiveItem}>{action}</Text>
        </TouchableOpacity>
        
      })}
    </View>;
  }
}

module.exports = TabBar;

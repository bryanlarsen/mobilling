'use strict';

var React = require('react-native');
var { StyleSheet, Text, View, Animated } = React;

export default React.createClass({
  render: function() {
    return(
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={styles.paddingView}></View>
          <View style={styles.fieldContainer}>
            <View style={styles.floatingLabel}>
              <Text style={[styles.fieldLabel]}>{this.props.label}</Text>
            </View>
            <View style={styles.holder}>
              {this.props.children}
            </View>
          </View>
          <View style={styles.paddingView}></View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    height: 45,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  paddingView: {
    width: 15
  },
  floatingLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 3
  },
  holder: {
    marginTop: 10
  },
  fieldLabel: {
    height: 10,
    fontSize: 9,
    color: '#B1B1B1'
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 1 / 2,
    borderColor: '#C8C7CC',
    position: 'relative'
  },
  valueText: {
    height: 20,
    fontSize: 16,
    color: '#111111'
  },
  withMargin: {
    marginTop: 10
  },
});

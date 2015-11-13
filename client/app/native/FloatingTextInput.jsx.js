'use strict';

var React = require('react-native');
var { StyleSheet, Text, View, TextInput, Animated } = React;

var FloatingLabel = React.createClass({
  getInitialState: function() {
    return {
      paddingAnim: new Animated.Value(this.props.visible ? 5 : 9),
      opacityAnim: new Animated.Value(this.props.visible ? 1 : 0)
    };
  },

  componentWillReceiveProps: function(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? 5 : 9,
      duration: 230
    }).start();

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? 1 : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={[styles.floatingLabel, {paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim}]}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var TextFieldHolder = React.createClass({
  getInitialState: function() {
    return {
      marginAnim: new Animated.Value(this.props.withValue ? 10 : 0)
    };
  },

  componentWillReceiveProps: function(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? 10 : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={{marginTop: this.state.marginAnim}}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var FloatLabelTextField = React.createClass({
  getInitialState: function() {
    return {
      focussed: false,
      text: this.props.value
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ text: nextProps.value });
  },
  focus: function() {
    this.refs.input.focus();
  },
  render: function() {
    return(
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={styles.paddingView}></View>
          <View style={styles.fieldContainer}>
            <FloatingLabel visible={this.state.text}>
              <Text style={[styles.fieldLabel, this.labelStyle()]}>{this.placeHolderValue()}</Text>
            </FloatingLabel>
            <TextFieldHolder withValue={this.state.text}>
              <TextInput
                ref="input"
                placeholder={this.props.placeHolder}
                style={[styles.valueText]}
                value={this.state.text}
                onFocus={this.setFocus}
                onBlur={this.unsetFocus}
                onChangeText={this.setText}
                secureTextEntry={this.props.secureTextEntry}
                returnKeyType={this.props.returnKeyType}
                onSubmitEditing={this.props.onSubmitEditing}
              />
            </TextFieldHolder>
          </View>
        </View>
      </View>
    );
  },
  setFocus: function(ev) {
    this.setState({
      focussed: true
    });
    return this.props.onFocus && this.props.onFocus(ev);
  },

  unsetFocus: function(ev) {
    this.setState({
      focussed: false
    });
    return this.props.onBlur && this.props.onBlur(ev, this.state.text);
  },

  labelStyle: function() {
    if (this.state.focussed) {
      return styles.focussed;
    }
  },

  placeHolderValue: function() {
    if (this.state.text) {
      return this.props.placeHolder;
    }
  },

  setText: function(value) {
    return this.setState({
      text: value
    });
  },

  withMargin: function() {
    if (this.state.text) {
      return styles.withMargin;
    }
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
    left: 0
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
  focussed: {
    color: "#1482fe"
  }
});

module.exports = FloatLabelTextField

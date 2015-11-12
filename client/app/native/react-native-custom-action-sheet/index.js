'use strict';

var React = require('react-native');
var Button = require('./button');
var FadeInView = require('./fade_in_view');
var { Modal, StyleSheet, TouchableOpacity, View, Dimensions} = React;
var window = Dimensions.get('window');

var ActionModal = React.createClass({
  render: function() {
    return (
      <FadeInView visible={this.props.modalVisible}>
        <Modal
          animated={true}
          transparent={true}
          visible={this.props.modalVisible}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.container} onPress={this.props.onCancel}></TouchableOpacity>
            {this.props.children}
            <Button onPress={this.props.onCancel} text={"Cancel"} />
          </View>
        </Modal>
      </FadeInView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    flex: 1,
    padding: 8,
    paddingBottom: 0,
    justifyContent: "flex-end"
  }
});

module.exports = ActionModal;

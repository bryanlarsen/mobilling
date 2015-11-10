const React = require('react-native');
const {Text, TextInput, ScrollView} = React;
const {pushState} = require('../../actions/nativeRouter');

const styles = require('./styles');

module.exports = React.createClass({
  render() {
    return <ScrollView style={styles.full} contentContainerStyle={styles.form}>
      <Text style={styles.label}>Login</Text>
      <TextInput
        ref="email"
        style={styles.input}
        onChangeText={(text) => this.props.actions.updateUserAttributes({email: text})}
        value={this.props.userStore.email}
        onSubmitEditing={() => this.refs.password.focus()}
        returnKeyType="go"
      />
      <Text style={styles.error}>{this.props.userStore.errors && this.props.userStore.errors.email}</Text>
      <Text>Password</Text>
      <TextInput
        ref="password"
        style={styles.input}
        onChangeText={(text) => this.props.actions.updateUserAttributes({password: text})}
        value={this.props.userStore.password}
        secureTextEntry={true}
        returnKeyType="go"
        onSubmitEditing={() => {this.props.actions.logIn(this.props.userStore, pushState(null, '/claims'));}}
      />
      <Text style={styles.error}>{this.props.userStore.errors && this.props.userStore.errors.password}</Text>
   </ScrollView>;
  }
});


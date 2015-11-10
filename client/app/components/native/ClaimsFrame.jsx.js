const _ = require('underscore');
const React = require('react-native');
const {Text, View, ScrollView, TouchableOpacity} = React;
const styles = require('./styles');
const dollars = require('../../data/dollars');

class ClaimsFrame extends React.Component {
  componentWillMount() {
    this.props.actions.refreshClaimList();
  }

  handlePress(id) {
    this.props.actions.pushState(null, `/claim/${id}/patient`);
  }

  render() {
    return <ScrollView style={styles.full} contentContainerStyle={styles.claimList}>
    {_.map(this.props.claimStore.claimList, (id) => {
      var claim = this.props.claimStore.claims[id];
      if (!claim) return false;
      return <TouchableOpacity key={id} onPress={this.handlePress.bind(this, id)}>
        <View style={styles.claimListRow}>
          <Text style={styles.claimListField}>{claim.number}</Text>
          <Text style={styles.claimListField}>{claim.service_date}</Text>
          <Text style={styles.claimListField}>{claim.patient_name}</Text>
          <Text style={styles.claimListField}>{dollars(claim.total_fee)}</Text>
        </View>
      </TouchableOpacity>;
    })}
    </ScrollView>
  }
};

module.exports = ClaimsFrame;

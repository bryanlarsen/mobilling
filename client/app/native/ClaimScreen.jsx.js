import _ from 'underscore';
import React, {Text, ActivityIndicatorIOS, View} from 'react-native';
import { TabBarIOS, Icon } from 'react-native-icons';
import dollars from '../data/dollars';
import claimTotal from '../data/claimTotal';
import styles from './styles';
import Toolbar from './Toolbar.jsx';
import PatientTab from './PatientTab.jsx';
import ClaimTab from './ClaimTab.jsx';

export default class ClaimScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 'patient'
    }
  }
  componentWillMount() {
    this.props.actions.refreshClaim(this.props.id);
  }

  render() {
    const claim = this.props.claimStore.claims[this.props.id];
    const handleUpdate = this.props.actions.updateClaim.bind(null, this.props.id);
    if (!claim) {
      return <ActivityIndicatorIOS style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }} size="large" />;
    }
    return <View style={styles.container}>
      <Toolbar
        title={`#${claim.number}: $${dollars(claimTotal(claim))}`}
        left="Claims"
        onPressLeft={() => this.props.navigator.pop()}
      />
      <TabBarIOS tintColor="white" barTintColor="darkslateblue">
        <TabBarIOS.Item title="Patient" iconName={"fontawesome|user"} selected={this.state.tab==="patient"} onPress={() => this.setState({tab: 'patient'})}>
          <PatientTab {...this.props} store={claim} claim={claim} onUpdate={handleUpdate} />
        </TabBarIOS.Item>
        <TabBarIOS.Item title="Claim" iconName="fontawesome|medkit" selected={this.state.tab==="claim"} onPress={() => this.setState({tab: 'claim'})}>
          <ClaimTab {...this.props} store={claim} claim={claim} onUpdate={handleUpdate} />
        </TabBarIOS.Item>
      </TabBarIOS>
    </View>;
  }
};

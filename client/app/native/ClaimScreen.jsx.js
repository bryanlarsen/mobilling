import _ from 'underscore';
import React, {Text, ActivityIndicatorIOS, View} from 'react-native';
import { TabBarIOS, Icon } from 'react-native-icons';
import dollars from '../data/dollars';
import claimTotal from '../data/claimTotal';
import styles from './styles';
import Toolbar from './Toolbar.jsx';
import PatientTab from './PatientTab.jsx';
import ClaimTab from './ClaimTab.jsx';
import CodesTab from './CodesTab.jsx';

export default class ClaimScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 'Patient'
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
    var tabs = [
      { name: 'Patient', icon: 'fontawesome|user', screen: PatientTab },
      { name: 'Claim', icon: 'fontawesome|medkit', screen: ClaimTab },
      { name: 'Consult', icon: 'fontawesome|user-md', screen: PatientTab },
      { name: 'Codes', icon: 'fontawesome|list-alt', screen: CodesTab },
      { name: 'Comments', icon: 'fontawesome|comment-o', screen: PatientTab }
    ]
    return <View style={styles.container}>
      <Toolbar
        title={`#${claim.number}: $${dollars(claimTotal(claim))}`}
        left="Claims"
        onPressLeft={() => this.props.navigator.pop()}
      />
      <TabBarIOS tintColor="white" barTintColor="darkslateblue">
      {tabs.map((tab) => {
        return <TabBarIOS.Item title={tab.name} iconName={tab.icon} selected={this.state.tab===tab.name} onPress={() => this.setState({tab: tab.name})}>
          {React.createElement(tab.screen, {...this.props, store: claim, claim, onUpdate: handleUpdate})}
        </TabBarIOS.Item>
      })}
      </TabBarIOS>
    </View>;
  }
};

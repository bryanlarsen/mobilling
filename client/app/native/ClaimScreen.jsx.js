import _ from 'underscore';
import React, {Text} from 'react-native';
import { TabBarIOS, Icon } from 'react-native-icons';
import styles from './styles';

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
    return <TabBarIOS tintColor="white" barTintColor="darkslateblue">
      <TabBarIOS.Item title="Patient" iconName={"fontawesome|user"} selected={this.state.tab==="patient"} onPress={() => this.setState({tab: 'patient'})}>
        <Text>Patient</Text>
      </TabBarIOS.Item>
      <TabBarIOS.Item title="Claim" iconName="fontawesome|medkit" selected={this.state.tab==="claim"} onPress={() => this.setState({tab: 'claim'})}>
        <Text>Claim</Text>
      </TabBarIOS.Item>
    </TabBarIOS>;
  }
};

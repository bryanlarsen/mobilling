import React, {ScrollView} from 'react-native';
import TextInputGroup from './TextInputGroup.jsx';
import styles from './styles';

export default class ClaimTab extends React.Component {
  render() {
    return <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      <TextInputGroup {...this.props} name="user_id" label="Doctor" />
      <TextInputGroup {...this.props} name="specialty" />
      <TextInputGroup {...this.props} name="hospital" label="Hospital" />
    </ScrollView>;
  }
};

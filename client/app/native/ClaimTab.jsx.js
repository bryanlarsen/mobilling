import React, {ScrollView} from 'react-native';
import TextInputGroup from './TextInputGroup.jsx';
import PickerInputGroup from './PickerInputGroup.jsx';
import AutocompleteInputGroup from './AutocompleteInputGroup.jsx';
import styles from './styles';
import SPECIALTIES from '../data/specialties';
import HOSPITALS from '../data/hospitals';

export default class ClaimTab extends React.Component {
  render() {
    return <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      <PickerInputGroup {...this.props} name="user_id" label="Doctor" options={this.props.userStore.doctors} />
      <PickerInputGroup {...this.props} name="specialty" options={SPECIALTIES} />
      <AutocompleteInputGroup {...this.props} name="hospital" label="Hospital" suggestions={HOSPITALS}/>
    </ScrollView>;
  }
};

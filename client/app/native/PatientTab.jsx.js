import _ from 'underscore';
import React, {ScrollView, PickerIOS} from 'react-native';
const PickerItem = PickerIOS.Item;
import TextInputGroup from './TextInputGroup.jsx';
import styles from './styles';
import provinces from '../data/provinces';
import FloatingTextInput from './FloatingTextInput.jsx';
import CustomActionSheet from './react-native-custom-action-sheet';

export default class PatientTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = { provinceOpen: false }
  }

  render() {
    return <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      <TextInputGroup {...this.props} name="patient_name" label="Patient Name" />
      <TextInputGroup {...this.props} name="patient_number" label="Health Number" />
      <TextInputGroup {...this.props} name="patient_province" label="Province" />
      <FloatingTextInput
        placeHolder="Province"
        value={this.props.claim.patient_province}
        onFocus={() => this.setState({provinceOpen: true})}
      />

      <CustomActionSheet modalVisible={this.state.provinceOpen} onCancel={this.toggleModal}>
        <PickerIOS selectedValue={this.props.claim.patient_province} >
          {_.map(provinces, (province, code) => <PickerItem
                                                  key={code} value={code} label={province}
                                                /> )}
        </PickerIOS>
      </CustomActionSheet>
      <TextInputGroup {...this.props} name="patient_birthday" label="Birth Date" />
      <TextInputGroup {...this.props} name="patient_sex" label="Sex" />
    </ScrollView>;
  }
};

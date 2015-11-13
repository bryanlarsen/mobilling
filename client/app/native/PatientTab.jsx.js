import _ from 'underscore';
import React, {ScrollView, View} from 'react-native';
import TextInputGroup from './TextInputGroup.jsx';
import PickerInputGroup from './PickerInputGroup.jsx';
import DatePickerInputGroup from './DatePickerInputGroup.jsx';
import SegmentedInputGroup from './SegmentedInputGroup.jsx';
import styles from './styles';
import provinces from '../data/provinces';

export default class PatientTab extends React.Component {
  render() {
    return <ScrollView style={styles.container} contentContainerStyle={styles.form}>
      <TextInputGroup {...this.props} name="patient_name" label="Patient Name" ref="name" returnKeyType="next" onSubmitEditing={() => this.refs.number.focus()} />
      <TextInputGroup {...this.props} name="patient_number" label="Health Number" ref="number" returnKeyType="next"  onSubmitEditing={() => this.refs.birthday.focus()} />
      <PickerInputGroup {...this.props} name="patient_province" label="Province" options={provinces}/>
      <DatePickerInputGroup {...this.props} name="patient_birthday" label="Birth Date" ref="birthday" />
      <SegmentedInputGroup {...this.props} name="patient_sex" label="Sex" options={{M: 'Male', F: 'Female'}}/>
    </ScrollView>;
  }
};

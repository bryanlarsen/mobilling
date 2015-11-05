import React from 'react';
import { NativePatient } from '../components';

const dispatch = function(action) {
  console.log('dispatch', action);
}
const NativePatientPage = props => {
  return <NativePatient {...props}
           dispatch={dispatch}
         />;
};

export default NativePatientPage;

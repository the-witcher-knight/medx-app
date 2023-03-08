import doctor from 'features/doctor-mgmt/doctorSlice';
import patient from 'features/patient-mgmt/patientSlice';
import testManagement from 'features/test-mgmt/testSlice';

const rootReducer = {
  patient,
  doctor,
  testManagement,
  // Add more reducers here
};

export default rootReducer;

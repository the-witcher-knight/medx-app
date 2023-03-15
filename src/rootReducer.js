import doctor from 'features/doctor-mgmt/doctorSlice';
import patient from 'features/patient-mgmt/patientSlice';
import testManagement from 'features/test-mgmt/testSlice';
import unit from 'features/unit-mgmt/unitSlice';

const rootReducer = {
  patient,
  doctor,
  unit,
  testManagement,
  // Add more reducers here
};

export default rootReducer;

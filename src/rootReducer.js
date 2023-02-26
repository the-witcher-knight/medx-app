import doctor from 'features/doctor-mgmt/doctorSlice';
import patient from 'features/patient-mgmt/patientSlice';

const rootReducer = {
  patient,
  doctor,
  // Add more reducers here
};

export default rootReducer;

import doctor from 'features/doctor-mgmt/doctorSlice';
import patient from 'features/patient-mgmt/patientSlice';
import testCategory from 'features/test-category-mgmt/testCategorySlice';
import testGroup from 'features/test-group-mgmt/testGroupSlice';
import testManagement from 'features/test-mgmt/testSlice';
import unit from 'features/unit-mgmt/unitSlice';

const rootReducer = {
  patient,
  doctor,
  unit,
  testManagement,
  testGroup,
  testCategory,
  // Add more reducers here
};

export default rootReducer;

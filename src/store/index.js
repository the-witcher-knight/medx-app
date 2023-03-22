import doctorSlice from './doctorSlice';
import indicationSlice from './indicationSlice';
import patientSlice from './patientSlice';
import testCategorySlice from './testCategorySlice';
import testGroupSlice from './testGroupSlice';
import unitSlice from './unitSlice';

const rootReducer = {
  patient: patientSlice,
  doctor: doctorSlice,
  unit: unitSlice,
  testCategory: testCategorySlice,
  testGroup: testGroupSlice,
  indication: indicationSlice,
};

export default rootReducer;

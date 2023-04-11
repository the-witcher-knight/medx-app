import doctorSlice from './doctorSlice';
import indicationSlice from './indicationSlice';
import patientSlice from './patientSlice';
import testCategorySlice from './testCategorySlice';
import testGroupSlice from './testGroupSlice';
import testManageSlice from './testManageSlice';
import unitSlice from './unitSlice';
import userSlice from './userSlice';

const rootReducer = {
  patient: patientSlice,
  doctor: doctorSlice,
  unit: unitSlice,
  testCategory: testCategorySlice,
  testGroup: testGroupSlice,
  indication: indicationSlice,
  testManage: testManageSlice,
  user: userSlice,
};

export default rootReducer;

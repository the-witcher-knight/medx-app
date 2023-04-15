import authReducer from './authSlice';
import doctorReducer from './doctorSlice';
import indicationReducer from './indicationSlice';
import patientReducer from './patientSlice';
import testCategoryReducer from './testCategorySlice';
import testGroupReducer from './testGroupSlice';
import testManageReducer from './testManageSlice';
import unitReducer from './unitSlice';
import userReducer from './userSlice';

const rootReducer = {
  patient: patientReducer,
  doctor: doctorReducer,
  unit: unitReducer,
  testCategory: testCategoryReducer,
  testGroup: testGroupReducer,
  indication: indicationReducer,
  testManage: testManageReducer,
  user: userReducer,
  auth: authReducer,
};

export default rootReducer;

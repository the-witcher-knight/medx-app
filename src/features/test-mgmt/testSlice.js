import { createSlice } from '@reduxjs/toolkit';

const apiURL = `${process.env.REACT_APP_API_URL}/Patient`;

const initialState = {
  loading: false,
  entity: null,
  entities: [],
  error: null,
};

// Actions

// Reducer
const testSlice = createSlice({
  name: 'testManagement',
  initialState,
  reducers: {},
});

export default testSlice.reducer;

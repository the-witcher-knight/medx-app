import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiURL = process.env.REACT_APP_API_URL;

const initialState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
};

// Actions

export const getPatients = createAsyncThunk('patient/getPatients', async () => {
  const resp = await axios.get(`${apiURL}/patients`, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
});

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default patientSlice.reducer;

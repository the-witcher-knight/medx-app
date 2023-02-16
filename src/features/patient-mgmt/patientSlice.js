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

export const fetchPatients = createAsyncThunk('patient/fetchPatients', async () => {
  const resp = await axios.get(`${apiURL}/patients`, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
});

export const getPatient = createAsyncThunk('patient/getPatient', async (id) => {
  const resp = await axios.get(`${apiURL}/patients/${id}`, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
});

export const deletePatient = createAsyncThunk('patient/deletePatient', async (id) => {
  const resp = await axios.delete(`${apiURL}/patients/${id}`, {
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
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPatient = action.payload;
      })
      .addCase(getPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default patientSlice.reducer;

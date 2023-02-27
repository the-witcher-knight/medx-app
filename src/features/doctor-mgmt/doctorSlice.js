import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiURL = process.env.REACT_APP_API_URL;

const initialState = {
  entity: null,
  entities: [],
  loading: false,
  error: null,
};

/**
 * Fetch all doctors
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchDoctors = createAsyncThunk('doctor/fetchDoctors', async (criteria) => {
  const resp = await axios.post(`${apiURL}/Doctor/search`, criteria, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

/**
 * Create a doctor
 */
export const createDoctor = createAsyncThunk('doctor/createDoctor', async (values) => {
  const resp = await axios.post(`${apiURL}/Doctor`, values, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data;
        }
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default doctorSlice.reducer;

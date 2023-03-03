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

/**
 * Fetch a doctor
 */
export const fetchDoctor = createAsyncThunk('doctor/fetchDoctor', async (id) => {
  const resp = await axios.get(`${apiURL}/Doctor/${id}`, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

/**
 * Update a doctor
 */
export const updateDoctor = createAsyncThunk('doctor/updateDoctor', async (values) => {
  const resp = await axios.put(`${apiURL}/Doctor/${values.id}`, values, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

/**
 * Delete a doctor
 */
export const deleteDoctor = createAsyncThunk('doctor/deleteDoctor', async (id) => {
  const resp = await axios.delete(`${apiURL}/Doctor/${id}`, {
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
          state.entities = data.data;
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
          state.entities.push(data);
        }
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default doctorSlice.reducer;

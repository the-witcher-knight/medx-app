import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { doctorAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  updateSuccess: null,
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
  const resp = await doctorAPI.getAll(criteria);

  return resp.data;
});

/**
 * Fetch a doctor
 */
export const fetchDoctor = createAsyncThunk('doctor/fetchDoctor', async (id) => {
  const resp = await doctorAPI.getByID(id);

  return resp.data;
});

/**
 * Create a doctor
 */
export const createDoctor = createAsyncThunk('doctor/createDoctor', async (values) => {
  const resp = await doctorAPI.create(values);

  return resp.data;
});

/**
 * Update a doctor
 */
export const updateDoctor = createAsyncThunk('doctor/updateDoctor', async (values) => {
  const resp = await doctorAPI.update(values);

  return resp.data;
});

/**
 * Delete a doctor
 */
export const deleteDoctor = createAsyncThunk('doctor/deleteDoctor', async (id) => {
  const resp = await doctorAPI.delete(id);

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

        state.updateSuccess = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
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
        state.updateSuccess = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = true;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      })
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      });
  },
});

export default doctorSlice.reducer;

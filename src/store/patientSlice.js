import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { patientAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  loading: false,
  error: null,
};

/**
 * Fetch all patients
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchPatients = createAsyncThunk('patient/fetchAll', async (criteria) => {
  const resp = await patientAPI.getAll(criteria);

  return resp.data;
});

/**
 * Fetch a patient
 */
export const fetchPatient = createAsyncThunk('patient/fetchOne', async (id) => {
  const resp = await patientAPI.getByID(id);

  return resp.data;
});

/**
 * Create a patient
 */
export const createPatient = createAsyncThunk('patient/createOne', async (values) => {
  const resp = await patientAPI.create(values);

  return resp.data;
});

/**
 * Update a patient
 */
export const updatePatient = createAsyncThunk('patient/updateOne', async (values) => {
  const resp = await patientAPI.update(values);

  return resp.data;
});

/**
 * Delete a patient
 */
export const deletePatient = createAsyncThunk('patient/deleteOne', async (id) => {
  const resp = await patientAPI.delete(id);

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
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.push(data);
        }
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default patientSlice.reducer;

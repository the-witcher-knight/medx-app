import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { patientAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  updateSuccess: null,
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

export const fetchPatientByPersonalID = createAsyncThunk(
  'patient/fetchByPersonalID',
  async (personalID) => {
    const resp = await patientAPI.getByPersonalID(personalID);

    return resp.data;
  }
);

export const fetchPatientByCode = createAsyncThunk('patient/fetchByCode', async (code) => {
  const resp = await patientAPI.getByCode(code);

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

        state.updateSuccess = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
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
      .addCase(fetchPatientByPersonalID.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchPatientByPersonalID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchPatientByPersonalID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientByCode.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchPatientByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchPatientByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      })
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      });
  },
});

export default patientSlice.reducer;

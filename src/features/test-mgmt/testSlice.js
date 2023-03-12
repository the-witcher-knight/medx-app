import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiURL = process.env.REACT_APP_API_URL;

const initialState = {
  loading: false,
  indications: [],
  doctors: [],
  entity: null,
  entities: [],
  error: null,
};

// Actions

/**
 * fetchIndication
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchIndications = createAsyncThunk(
  'testManagement/fetchIndications',
  async (criteria) => {
    const resp = await axios.post(`${apiURL}/Indication/search`, criteria, {
      headers: {
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
      },
    });

    return resp.data;
  }
);

/**
 * Fetch all doctors
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchDoctors = createAsyncThunk('testManagement/fetchDoctors', async (criteria) => {
  const resp = await axios.post(`${apiURL}/Doctor/search`, criteria, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

// Reducer
const testSlice = createSlice({
  name: 'testManagement',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchIndications.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchIndications.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.indications = data.data;
        }
      })
      .addCase(fetchIndications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
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
          state.doctors = data.data;
        }
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default testSlice.reducer;

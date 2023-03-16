import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiURL = `${process.env.REACT_APP_API_URL}/TestCategory`;

const initialState = {
  entity: null,
  entities: [],
  units: [],
  groups: [],
  loading: false,
  error: null,
};

/**
 * Fetch all test categories
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchAll = createAsyncThunk('testCategory/fetchAll', async (criteria) => {
  const resp = await axios.post(`${apiURL}/search`, criteria, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

/**
 * Create a test category
 */
export const createOne = createAsyncThunk('testCategory/createOne', async (values) => {
  const resp = await axios.post(`${apiURL}`, values, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

/**
 * Fetch a test category
 */
export const fetchOne = createAsyncThunk('testCategory/fetchOne', async (id) => {
  const resp = await axios.get(`${apiURL}/${id}`, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

/**
 * Update a test category
 */
export const updateOne = createAsyncThunk('testCategory/updateOne', async (values) => {
  const resp = await axios.put(`${apiURL}/${values.id}`, values, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

/**
 * Delete a test category
 */
export const deleteOne = createAsyncThunk('testCategory/deleteOne', async (id) => {
  const resp = await axios.delete(`${apiURL}/${id}`, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data;
});

const testCategorySlice = createSlice({
  name: 'unitSlice',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOne.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.push(data);
        }
      })
      .addCase(createOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOne.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOne.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updateOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOne.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deleteOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default testCategorySlice.reducer;

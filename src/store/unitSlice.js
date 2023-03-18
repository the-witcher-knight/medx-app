import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { unitAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  loading: false,
  error: null,
};

/**
 * Fetch all units
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchUnits = createAsyncThunk('unit/fetchAll', async (criteria) => {
  const resp = await unitAPI.getAll(criteria);

  return resp.data;
});

/**
 * Create a unit
 */
export const createUnit = createAsyncThunk('unit/createOne', async (values) => {
  const resp = await unitAPI.create(values);

  return resp.data;
});

/**
 * Fetch a unit
 */
export const fetchUnit = createAsyncThunk('unit/fetchOne', async (id) => {
  const resp = await unitAPI.getByID(id);

  return resp.data;
});

/**
 * Update a unit
 */
export const updateUnit = createAsyncThunk('unit/updateOne', async (values) => {
  const resp = await unitAPI.update(values);

  return resp.data;
});

/**
 * Delete a unit
 */
export const deleteUnit = createAsyncThunk('unit/deleteOne', async (id) => {
  const resp = await unitAPI.delete(id);

  return resp.data;
});

const unitSlice = createSlice({
  name: 'unitSlice',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.push(data);
        }
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnit.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default unitSlice.reducer;

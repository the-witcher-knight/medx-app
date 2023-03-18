import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import testGroupAPI from 'apis/test-group';

const initialState = {
  entity: null,
  entities: [],
  loading: false,
  error: null,
};

/**
 * Fetch all test groups
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchTestGroups = createAsyncThunk('testGroup/fetchAll', async (criteria) => {
  const resp = await testGroupAPI.getAll(criteria);

  return resp.data;
});

/**
 * Fetch a test group
 */
export const fetchTestGroup = createAsyncThunk('testGroup/fetchOne', async (id) => {
  const resp = await testGroupAPI.getByID(id);

  return resp.data;
});

/**
 * Create a test group
 */
export const createTestGroup = createAsyncThunk('testGroup/createOne', async (values) => {
  const resp = await testGroupAPI.create(values);

  return resp.data;
});

/**
 * Update a test group
 */
export const updateTestGroup = createAsyncThunk('testGroup/updateOne', async (values) => {
  const resp = await testGroupAPI.update(values);

  return resp.data;
});

/**
 * Delete a test group
 */
export const deleteTestGroup = createAsyncThunk('testGroup/deleteOne', async (id) => {
  const resp = await testGroupAPI.delete;

  return resp.data;
});

const testGroupSlice = createSlice({
  name: 'testGroupSlice',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTestGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestGroups.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(fetchTestGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createTestGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestGroup.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.push(data);
        }
      })
      .addCase(createTestGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchTestGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestGroup.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchTestGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateTestGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestGroup.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updateTestGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteTestGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestGroup.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deleteTestGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default testGroupSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { testManageAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  testIndications: [],
  loading: false,
  error: null,
};

/**
 * Fetch all tests
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchTests = createAsyncThunk('testManage/fetchAll', async (criteria) => {
  const resp = await testManageAPI.getAll(criteria);

  return resp.data;
});

export const fetchTest = createAsyncThunk('testManage/fetchOne', async (id) => {
  const resp = await testManageAPI.getByID(id);

  return resp.data;
});

/**
 * Create a test
 */
export const createTest = createAsyncThunk('testManage/createOne', async (values) => {
  const resp = await testManageAPI.create(values);

  return resp.data;
});

/**
 * Update a test
 */
export const updateTest = createAsyncThunk('testManage/updateOne', async (values) => {
  const resp = await testManageAPI.update(values);

  return resp.data;
});

/**
 * Delete a test
 */
export const deleteTest = createAsyncThunk('testManage/deleteOne', async (id) => {
  const resp = await testManageAPI.delete(id);

  return resp.data;
});

/**
 * Add indication for a test
 */
export const editIndication = createAsyncThunk('testManage/editIndication', async (values) => {
  const resp = await testManageAPI.editIndication(values);

  return resp.data;
});

/**
 * Get all indication of a test
 */
export const getIndications = createAsyncThunk('testManage/getIndication', async (testID) => {
  const resp = await testManageAPI.getIndications(testID);

  return resp.data;
});

/**
 * Get details of a test
 */
export const getTestDetails = createAsyncThunk('testManage/getTestDetails', async (testID) => {
  const resp = await testManageAPI.getTestDetails(testID);

  return resp.data;
});

/**
 * update test detail
 */
export const updateTestDetail = createAsyncThunk('testManage/updateTestDetail', async (values) => {
  const resp = await testManageAPI.updateTestDetail(values);

  return resp.data;
});

const testManageSlice = createSlice({
  name: 'testManage',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTest.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.push(data);
          state.entity = data; // Save new created test to store
        }
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getIndications.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getIndications.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(getIndications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default testManageSlice.reducer;

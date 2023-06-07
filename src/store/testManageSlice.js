import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { testManageAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  testIndications: [],
  testDetails: [],
  page: null,
  loading: false,
  testDetailUploading: null,
  updateSuccess: null,
  updateStatusSuccess: null,
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
export const updateTestIndication = createAsyncThunk(
  'testManage/editIndication',
  async (values) => {
    const resp = await testManageAPI.editIndication(values);

    return resp.data;
  }
);

/**
 * Get all indication of a test
 */
export const fetchTestIndications = createAsyncThunk(
  'testManage/fetchTestIndications',
  async (testID) => {
    const resp = await testManageAPI.getIndications(testID);

    return resp.data;
  }
);

/**
 * Get details of a test
 */
export const fetchTestDetails = createAsyncThunk('testManage/getTestDetails', async (testID) => {
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

export const updateTestStatus = createAsyncThunk('testManage/updateTestStatus', async (values) => {
  const resp = await testManageAPI.updateTestStatus(values);

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
        state.updateSuccess = null;

        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
          state.page = {
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalRows: data.totalRows,
            totalPrice: data.totalPrice,
          };
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
        state.updateSuccess = null;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      })
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      })
      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      })
      .addCase(fetchTestIndications.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTestIndications.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.testIndications = data;
        }
      })
      .addCase(fetchTestIndications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateTestIndication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestIndication.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.testIndications = data;
        }
      })
      .addCase(updateTestIndication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchTestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestDetails.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.testDetails = data;
        }
      })
      .addCase(fetchTestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateTestDetail.pending, (state) => {
        state.testDetailUploading = true;
        state.error = null;
      })
      .addCase(updateTestDetail.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.testDetailUploading = false;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(updateTestDetail.rejected, (state, action) => {
        state.testDetailUploading = null;
        state.error = action.error;
      })
      .addCase(updateTestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatusSuccess = null;
      })
      .addCase(updateTestStatus.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateStatusSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(updateTestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateStatusSuccess = false;
      });
  },
});

export default testManageSlice.reducer;

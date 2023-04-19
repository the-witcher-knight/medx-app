import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { testCategoryAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  units: [],
  groups: [],
  updateSuccess: null,
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
export const fetchTestCategories = createAsyncThunk('testCategory/fetchAll', async (criteria) => {
  const resp = await testCategoryAPI.getAll(criteria);

  return resp.data;
});

/**
 * Create a test category
 */
export const createCategory = createAsyncThunk('testCategory/createOne', async (values) => {
  const resp = await testCategoryAPI.create(values);

  return resp.data;
});

/**
 * Fetch a test category
 */
export const fetchCategory = createAsyncThunk('testCategory/fetchOne', async (id) => {
  const resp = await testCategoryAPI.getByID(id);

  return resp.data;
});

/**
 * Update a test category
 */
export const updateCategory = createAsyncThunk('testCategory/updateOne', async (values) => {
  const resp = await testCategoryAPI.update(values);

  return resp.data;
});

/**
 * Delete a test category
 */
export const deleteCategory = createAsyncThunk('testCategory/deleteOne', async (id) => {
  const resp = await testCategoryAPI.delete(id);

  return resp.data;
});

const testCategorySlice = createSlice({
  name: 'testCategory',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTestCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestCategories.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }

        state.updateSuccess = null;
      })
      .addCase(fetchTestCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      })
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;

        state.loading = false;
        state.updateSuccess = isSuccess;
        if (!isSuccess) {
          state.error = { message };
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.updateSuccess = false;
      });
  },
});

export default testCategorySlice.reducer;

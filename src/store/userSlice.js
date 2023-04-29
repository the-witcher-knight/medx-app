import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  loading: false,
  error: null,
};

/**
 * Fetch all users
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchUsers = createAsyncThunk('user/fetchAll', async (criteria) => {
  const resp = await userAPI.getAll(criteria);

  return resp.data;
});

/**
 * Fetch a user
 */
export const fetchUser = createAsyncThunk('user/fetchOne', async (id) => {
  const resp = await userAPI.getByID(id);

  return resp.data.result;
});

/**
 * Create a user
 */
export const createUser = createAsyncThunk('user/createOne', async (values) => {
  const resp = await userAPI.create(values);

  return resp.data;
});

/**
 * Update a user
 */
export const updateUser = createAsyncThunk('user/updateOne', async (values) => {
  const resp = await userAPI.update(values);

  return resp.data;
});

/**
 * Delete a user
 */
export const deleteUser = createAsyncThunk('user/deleteOne', async (id) => {
  const resp = await userAPI.delete(id);

  return resp.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.push(data);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const { isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default userSlice.reducer;

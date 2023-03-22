import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indicationAPI } from 'apis';

const initialState = {
  entity: null,
  entities: [],
  loading: false,
  error: null,
};

/**
 * Fetch all indications
 * @param {object} criteria - search criteria
 * @param {Array} criteria.filters - array of filters ```{fieldName: "name", operation: "like", value: "John"}```
 * @param {object} criteria.sortBy - sort criteria ```{fieldName: "name", accending: true}```
 * @param {number} criteria.pageIndex - page index number
 * @param {number} criteria.pageSize - page size number
 */
export const fetchIndications = createAsyncThunk('indication/fetchAll', async (criteria) => {
  const resp = await indicationAPI.getAll(criteria);

  return resp.data;
});

/**
 * Create a indication
 */
export const createIndication = createAsyncThunk('indication/createOne', async (values) => {
  const resp = await indicationAPI.create(values);

  return resp.data;
});

/**
 * Fetch a indication
 */
export const fetchIndication = createAsyncThunk('indication/fetchOne', async (id) => {
  const resp = await indicationAPI.getByID(id);

  return resp.data;
});

/**
 * Update a indication
 */
export const updateIndication = createAsyncThunk('indication/updateOne', async (values) => {
  const resp = await fetchIndication.update(values);

  return resp.data;
});

/**
 * Delete a indication
 */
export const deleteIndication = createAsyncThunk('indication/deleteOne', async (id) => {
  const resp = await indicationAPI.delete(id);

  return resp.data;
});

const indicationSlice = createSlice({
  name: 'indication',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchIndications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndications.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities = data.data;
        }
      })
      .addCase(fetchIndications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createIndication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIndication.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.push(data);
        }
      })
      .addCase(createIndication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchIndication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndication.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entity = data;
        }
      })
      .addCase(fetchIndication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateIndication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIndication.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          const idx = state.entities.findIndex((entity) => entity.id === data.id);
          state.entities[idx] = data;
        }
      })
      .addCase(updateIndication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteIndication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIndication.fulfilled, (state, action) => {
        const { data, isSuccess, message } = action.payload;
        const { arg } = action.meta;

        state.loading = false;
        if (!isSuccess) {
          state.error = { message };
        } else {
          state.entities.filter((entity) => entity.id !== arg);
        }
      })
      .addCase(deleteIndication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default indicationSlice.reducer;

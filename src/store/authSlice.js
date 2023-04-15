import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authAPI } from 'apis';
import StorageAPI from 'common/storageAPI';
import { AuthLoginKey } from 'constants';

const initialState = {
  loggedIn: StorageAPI.local.get(AuthLoginKey) || false,
  loading: false,
  accountInfo: {},
  err: null,
  success: null,
};

const authenticate = createAsyncThunk('auth/Authenticate', async ({ userName, password }) => {
  const resp = await authAPI.login({ userName, password });

  return resp.data;
});

export const login = (userName, password) => async (dispatch) => {
  const result = await dispatch(authenticate({ userName, password }));
  const resp = result.payload;
  StorageAPI.local.set(AuthLoginKey, resp);
};

export const logout = () => {
  StorageAPI.local.remove(AuthLoginKey);
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(authenticate.pending, (state) => {
        state.loggedIn = false;
        state.loading = true;
        state.err = null;
        state.success = null;
      })
      .addCase(authenticate.fulfilled, (state) => {
        state.loading = false;
        state.loggedIn = false;
        state.err = null;
        state.success = true;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.loading = false;
        state.loggedIn = false;
        state.err = action.error;
        state.success = false;
      });
  },
});

export default authSlice.reducer;

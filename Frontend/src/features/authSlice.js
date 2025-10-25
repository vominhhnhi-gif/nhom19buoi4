import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAccessToken, removeAccessToken, getAccessToken, setAuthFromLocalStorage } from '../lib/api';

setAuthFromLocalStorage();

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/profile');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data?.token;
    if (token) setAccessToken(token);
    return token;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    removeAccessToken();
    return true;
  } catch (err) {
    removeAccessToken();
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const initialState = {
  token: getAccessToken(),
  user: null,
  status: 'idle',
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearAuthState(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.status = 'succeeded'; state.token = action.payload; })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(fetchProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      .addCase(fetchProfile.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.token = null; state.user = null; state.status = 'idle'; });
  }
});

export const { setUser, clearAuthState } = slice.actions;
export default slice.reducer;

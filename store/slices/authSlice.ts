
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return {
        name: session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        role: 'Student',
      };
    }

    return {
      name: profile?.name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
      role: profile?.role || 'Student',
      institute: profile?.institute,
      mobile: profile?.mobile,
    };
  } catch (e) {
    console.warn("Session restoration failed due to network error:", e);
    return null;
  }
});

export const signOutUser = createAsyncThunk('auth/signOut', async () => {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error("Sign out network error:", e);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

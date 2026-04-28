import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import {
  ROUTE_CONTACT_SUBMIT,
  ROUTE_ADMIN_CONTACTS,
  ROUTE_ADMIN_CONTACT_DELETE,
} from "@/utils/routes";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ContactSubmitPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactsState {
  // Public
  submitLoading: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  // Admin
  list: Contact[];
  listLoading: boolean;
  listError: string | null;
  deleteLoading: string | null; // holds the id being deleted
}

const initialState: ContactsState = {
  submitLoading: false,
  submitError: null,
  submitSuccess: false,
  list: [],
  listLoading: false,
  listError: null,
  deleteLoading: null,
};

// ── Thunks ────────────────────────────────────────────────────────────────────

/** Public — submit contact form */
export const submitContact = createAsyncThunk<void, ContactSubmitPayload>(
  "contacts/submit",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.post(ROUTE_CONTACT_SUBMIT, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? "Failed to send message");
    }
  }
);

/** Admin — fetch all contact submissions */
export const fetchAdminContacts = createAsyncThunk<Contact[]>(
  "contacts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<Contact[]>(ROUTE_ADMIN_CONTACTS);
      return data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) return rejectWithValue("Session expired — please log in again.");
      return rejectWithValue(err.response?.data?.error ?? "Failed to load contacts");
    }
  }
);

/** Admin — delete a contact submission */
export const deleteContact = createAsyncThunk<string, string>(
  "contacts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ROUTE_ADMIN_CONTACT_DELETE(id));
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? "Delete failed");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    resetSubmit(state) {
      state.submitSuccess = false;
      state.submitError = null;
    },
    clearListError(state) {
      state.listError = null;
    },
  },
  extraReducers: (builder) => {
    // submitContact
    builder
      .addCase(submitContact.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.submitLoading = false;
        state.submitSuccess = true;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload as string;
      });

    // fetchAdminContacts
    builder
      .addCase(fetchAdminContacts.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAdminContacts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchAdminContacts.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      });

    // deleteContact
    builder
      .addCase(deleteContact.pending, (state, action) => {
        state.deleteLoading = action.meta.arg;
        // Optimistic remove
        state.list = state.list.filter((c) => c.id !== action.meta.arg);
      })
      .addCase(deleteContact.fulfilled, (state) => {
        state.deleteLoading = null;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.deleteLoading = null;
        state.listError = action.payload as string;
      });
  },
});

export const { resetSubmit, clearListError } = contactsSlice.actions;
export default contactsSlice.reducer;

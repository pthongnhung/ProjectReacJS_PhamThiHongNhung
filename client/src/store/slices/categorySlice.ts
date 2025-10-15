/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import categoryApi from "../../apis/categoryApi";
import type {
  Category,
  CategoryPayload,
  CategoryQuery,
} from "../../types/category";

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  limit: 5,
  total: 0,
};

export const fetchCategories = createAsyncThunk<
  { data: Category[]; total: number },
  CategoryQuery | undefined,
  { rejectValue: string }
>("categories/fetchAll", async (query, thunkApi) => {
  try {
    return await categoryApi.getAll(query);
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Tải danh mục thất bại");
  }
});

export const createCategory = createAsyncThunk<
  Category,
  CategoryPayload,
  { rejectValue: string }
>("categories/create", async (body, thunkApi) => {
  try {
    return await categoryApi.create(body);
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Tạo danh mục thất bại");
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  { id: number; body: CategoryPayload },
  { rejectValue: string }
>("categories/update", async ({ id, body }, thunkApi) => {
  try {
    return await categoryApi.update(id, body);
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Cập nhật danh mục thất bại");
  }
});

export const deleteCategory = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("categories/delete", async (id, thunkApi) => {
  try {
    await categoryApi.remove(id);
    return id;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Xoá danh mục thất bại");
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setPage: (s, a: PayloadAction<number>) => {
      s.page = a.payload;
    },
    setLimit: (s, a: PayloadAction<number>) => {
      s.limit = a.payload;
      s.page = 1;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCategories.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchCategories.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload.data;
      s.total = a.payload.total;
    });
    b.addCase(fetchCategories.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Tải danh mục thất bại";
    });

    b.addCase(createCategory.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(createCategory.fulfilled, (s, a) => {
      s.loading = false;

      const oldTotal = s.total || 0;
      const newTotal = oldTotal + 1;
      s.total = newTotal;

      const lastPage = Math.max(1, Math.ceil(newTotal / Math.max(1, s.limit)));
      if (s.page === lastPage) {
        s.items.push(a.payload);

        if (s.items.length > s.limit) {
          s.items.shift();
        }
      }
    });

    b.addCase(createCategory.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Tạo danh mục thất bại";
    });

    b.addCase(updateCategory.fulfilled, (s, a) => {
      const i = s.items.findIndex((x) => x.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });

    b.addCase(deleteCategory.fulfilled, (s, a) => {
      s.items = s.items.filter((x) => x.id !== a.payload);
      s.total -= 1;
    });
  },
});

export const { setPage, setLimit } = categorySlice.actions;
export default categorySlice.reducer;

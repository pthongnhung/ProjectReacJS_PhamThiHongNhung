/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import vocabApi, { Paginated } from "../../apis/vocabApi";
import type { Vocab, VocabPayload, VocabQuery } from "../../types/vocab";

interface VocabState {
  items: Vocab[];
  loading: boolean;
  error: string | null;

  // phân trang
  page: number;
  limit: number;
  total: number;

  // filter
  q: string;
  categoryId: number | "";
}

const initialState: VocabState = {
  items: [],
  loading: false,
  error: null,

  page: 1,
  limit: 5,
  total: 0,

  q: "",
  categoryId: "",
};

export const fetchVocabs = createAsyncThunk<
  Paginated<Vocab>,
  void,
  { state: any; rejectValue: string }
>("vocabs/fetchAll", async (_, thunkApi) => {
  try {
    const s = thunkApi.getState().vocabs as VocabState;
    const params: VocabQuery = {
      q: s.q || undefined,
      categoryId: s.categoryId === "" ? undefined : s.categoryId,
      _page: s.page,
      _limit: s.limit,
    };
    return await vocabApi.getAll(params);
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Tải từ vựng thất bại");
  }
});

export const createVocab = createAsyncThunk<
  Vocab,
  VocabPayload,
  { rejectValue: string }
>("vocabs/create", async (body, thunkApi) => {
  try {
    const data = await vocabApi.create(body);
    return data;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Tạo từ vựng thất bại");
  }
});

export const updateVocab = createAsyncThunk<
  Vocab,
  { id: number; body: VocabPayload },
  { rejectValue: string }
>("vocabs/update", async ({ id, body }, thunkApi) => {
  try {
    return await vocabApi.update(id, body);
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Cập nhật từ vựng thất bại");
  }
});

export const deleteVocab = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("vocabs/delete", async (id, thunkApi) => {
  try {
    await vocabApi.remove(id);
    return id;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e?.message || "Xoá từ vựng thất bại");
  }
});

const vocabSlice = createSlice({
  name: "vocabs",
  initialState,
  reducers: {
    setPage: (s, a: { payload: number }) => {
      s.page = a.payload;
    },
    setLimit: (s, a: { payload: number }) => {
      s.limit = a.payload;
      s.page = 1; // reset về trang 1 khi đổi limit
    },
    setSearch: (s, a: { payload: string }) => {
      s.q = a.payload;
      s.page = 1;
    },
    setCategoryFilter: (s, a: { payload: number | "" }) => {
      s.categoryId = a.payload;
      s.page = 1;
    },
    // có thể thêm resetFilter nếu cần
  },
  extraReducers: (b) => {
    b.addCase(fetchVocabs.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchVocabs.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload.data;
      s.total = a.payload.total;
    });
    b.addCase(fetchVocabs.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Tải từ vựng thất bại";
    });

    b.addCase(createVocab.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(createVocab.fulfilled, (s, a) => {
      s.loading = false;
      // có thể push lên đầu; nhưng để đồng bộ total/paging, tốt nhất fetch lại sau khi tạo từ trang UI
      s.items.unshift(a.payload);
      s.total += 1;
    });
    b.addCase(createVocab.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Tạo từ vựng thất bại";
    });

    b.addCase(updateVocab.fulfilled, (s, a) => {
      const i = s.items.findIndex((x) => x.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload;
    });

    b.addCase(deleteVocab.fulfilled, (s, a) => {
      s.items = s.items.filter((x) => x.id !== a.payload);
      s.total = Math.max(0, s.total - 1);
    });
  },
});

export const { setPage, setLimit, setSearch, setCategoryFilter } =
  vocabSlice.actions;
export default vocabSlice.reducer;

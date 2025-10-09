import axiosClient from "./axiosClient";
import type { Vocab, VocabPayload, VocabQuery } from "../types/vocab";

export type Paginated<T> = { data: T[]; total: number };

const vocabApi = {
  async getAll(params: VocabQuery = {}): Promise<Paginated<Vocab>> {
    const res = await axiosClient.get<Vocab[]>("/vocabs", { params });
    const total = Number(res.headers?.["x-total-count"] || 0);
    return { data: res.data, total };
  },

  async create(body: VocabPayload): Promise<Vocab> {
    const { data } = await axiosClient.post<Vocab>("/vocabs", body);
    return data;
  },

  async update(id: number, body: VocabPayload): Promise<Vocab> {
    const { data } = await axiosClient.patch<Vocab>(`/vocabs/${id}`, body);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosClient.delete(`/vocabs/${id}`);
  },
};

export default vocabApi;

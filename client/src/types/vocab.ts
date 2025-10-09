export interface Vocab {
  id: number;
  word: string;
  meaning: string;
  categoryId: number;
}

export interface VocabPayload {
  word: string;
  meaning: string;
  categoryId: number;
}

export interface VocabQuery {
  q?: string;
  categoryId?: number | "";
  _page?: number;
  _limit?: number;
}

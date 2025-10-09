export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

export interface CategoryQuery {
  q?: string; // tìm theo name (json-server hỗ trợ q)
  _page?: number;
  _limit?: number;
}

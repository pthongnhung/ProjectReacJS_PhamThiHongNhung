import { useMemo } from "react";

export default function usePagination(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  const canPrev = page > 1;
  const canNext = page < totalPages;

  // tạo mảng trang đơn giản: [1 .. totalPages] (có thể nâng cấp thêm ellipsis nếu muốn)
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return { totalPages, canPrev, canNext, pages };
}

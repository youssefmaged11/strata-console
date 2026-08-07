import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, pageCount, total, pageSize, onChange }: { page: number; pageCount: number; total: number; pageSize: number; onChange: (page: number) => void }) {
  const start = total ? (page - 1) * pageSize + 1 : 0;
  return (
    <div className="pagination">
      <span>{start}–{Math.min(page * pageSize, total)} of {total}</span>
      <button className="icon-button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft /></button>
      <strong>{page} / {pageCount}</strong>
      <button className="icon-button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onChange(page + 1)}><ChevronRight /></button>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onInit?: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div data-pagination className="flex justify-center items-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm bg-white text-[#d45d79] rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#d45d79] transition-colors"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm bg-white text-[#d45d79] rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#d45d79] transition-colors"
      >
        Next
      </button>
    </div>
  );
}

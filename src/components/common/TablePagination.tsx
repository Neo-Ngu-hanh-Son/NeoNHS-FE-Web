import { Button } from "../ui/button";

type Props = {
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function TablePagination({
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(totalElements / pageSize);
  const rangeStart = currentPage * pageSize + 1;
  const rangeEnd = Math.min((currentPage + 1) * pageSize, totalElements);
  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-sm text-gray-500">
        Showing {rangeStart} to {rangeEnd} of {totalElements} results
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-3 text-xs"
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            className={i === currentPage ? "h-8 w-8 p-0 text-xs" : "h-8 w-8 p-0 text-xs"}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-3 text-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

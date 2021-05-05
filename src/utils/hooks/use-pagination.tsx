import { useCallback, useState } from "react";
import classNames from "classnames";
import { Response } from "src/api";
import { RCPagination, RCPaginationProps } from "src/components";

interface UsePaginationProps<T> {
  paginationProps?: RCPaginationProps;
  paginatedObject: Response<T>;
  className?: string;
}

export function usePagination<T>({
  paginatedObject,
  paginationProps,
  className = "",
}: UsePaginationProps<T>) {
  const {
    totalElements,
    totalPages,
    pageable: { pageNumber = 0, pageSize = 0 } = {},
  } = paginatedObject ?? {};
  const [currentPage, setCurrentPage] = useState(pageNumber + 1);

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => setCurrentPage(page),
    [currentPage]
  );

  const PaginationComponent =
    totalPages > 1 ? (
      <div
        className={classNames(
          "flex",
          "justify-end",
          "items-end",
          "p-6",
          className
        )}
      >
        <RCPagination
          current={currentPage}
          total={totalElements}
          pageSize={pageSize}
          onChange={handlePageChange}
          {...paginationProps}
        />
      </div>
    ) : null;

  return {
    currentPage: currentPage - 1,
    PaginationComponent,
  };
}

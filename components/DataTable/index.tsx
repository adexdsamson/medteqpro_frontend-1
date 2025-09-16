"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Table as TableType,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { ReactNode } from "react";

type DataTableOptions = {
  disablePagination: boolean;
  disableSelection: boolean;
  isLoading: boolean;
  totalCounts: number;
  manualPagination: boolean;
  setPagination: OnChangeFn<PaginationState>;
  pagination: PaginationState;
};

type DataTable<T = unknown> = {
  data: T[];
  columns: ColumnDef<T>[];
  header?: (value: TableType<T>) => ReactNode;
  options?: Partial<DataTableOptions>;
};

export function DataTable<T = unknown>({
  data,
  columns,
  header,
  options,
}: DataTable<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    onPaginationChange: options?.setPagination,
    onSortingChange: setSorting,
    rowCount: options?.totalCounts,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,

      pagination: options?.pagination ?? { pageIndex: 0, pageSize: 10 },
    },
  });

  const activePage = table?.getState()?.pagination?.pageIndex + 1;

  return (
    <div className="w-full">
      <div className="">
        {header && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 py-4">
            {header?.(table)}
          </div>
        )}
        {/* Horizontal scroll container with fixed boundaries */}
        <div className="relative w-full overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <Table className="border-separate border-spacing-y-3 min-w-[500px] w-full">
              <TableHeader className="bg-accent">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          className="h-10 px-4 text-sm whitespace-nowrap min-w-[120px]"
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length && !options?.isLoading ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className="text-xs text-wrap"
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : options?.isLoading ? (
                  [1, 2, 3, 4, 5].map((_, index) => (
                    <TableRow key={index}>
                      {[1].map((_, index) => (
                        <TableCell
                          key={index}
                          colSpan={columns.length}
                          className="h-10 text-center p-4"
                        >
                          <Skeleton key={index} className="h-4 bg-slate-300" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center p-4 text-sm"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-0 py-4">
        {!options?.disableSelection ? (
          <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        ) : (
          <div></div>
        )}

        {!options?.disablePagination && (
          <Pagination className="justify-center sm:justify-end pt-0">
            <PaginationContent className="flex-wrap gap-1">
              <PaginationItem>
                <PaginationPrevious
                  className="h-10 w-auto px-4 text-sm touch-manipulation"
                  onClick={() => {
                    table.previousPage();
                  }}
                />
              </PaginationItem>

              {createPageNumbers(
                table.getPageCount(),
                table.getState().pagination.pageIndex + 1
              ).map((page) =>
                typeof page === "string" ? (
                  <PaginationItem key={page} className="hidden sm:block">
                    <PaginationEllipsis className="h-10 w-10" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={activePage === page}
                      className="h-10 w-10 text-sm touch-manipulation min-w-[40px]"
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  className="h-10 w-auto px-4 text-sm touch-manipulation"
                  onClick={() => {
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

const createPageNumbers = (totalPages: number, currentPage: number) => {
  const pageNumbers = [];
  const pageRangeDisplayed = 2; // Number of pages to display around the current page
  //  const breakPoint = 2; // When to show breaklines

  // Generate the page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Always show the first page
      i === totalPages || // Always show the last page
      (i >= currentPage - pageRangeDisplayed &&
        i <= currentPage + pageRangeDisplayed) // Show pages around the current page
    ) {
      pageNumbers.push(i);
    } else if (
      (i === 2 || i === totalPages - 1) && // Show second and second last page if breakline exists
      pageNumbers[pageNumbers.length - 1] !== "..."
    ) {
      pageNumbers.push("...");
    }
  }

  return pageNumbers;
};

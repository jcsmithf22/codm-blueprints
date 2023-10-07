"use client";
import React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  FilterFn,
} from "@tanstack/react-table";
import { classNames } from "@/utils/functions";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { SearchContext } from "../SearchProvider";
import { Input } from "../ui/input";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the ranking info
  addMeta(itemRank);

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const columnClass: { [key: string]: string } = {
  id: "pl-4 pr-3 font-medium text-gray-900 sm:pl-6",
  actions: "relative pl-3 pr-4 text-right font-medium sm:pr-6",
};

export function Table<T>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T, any>[];
}) {
  const { globalFilter, setGlobalFilter } = React.useContext(SearchContext);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="my-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className={classNames(
                          "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                          columnClass[header.column.id]
                        )}
                        key={header.id}
                      >
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex gap-x-1 items-center"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                width={14}
                                height={14}
                                strokeWidth={1.5}
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                width={14}
                                height={14}
                                strokeWidth={1.5}
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <div className="w-3.5 h-2" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className={classNames(
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500 h-10",
                          columnClass[cell.column.id]
                        )}
                        key={cell.id}
                      >
                        <div className="max-h-20 overflow-y-scroll ">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// A debounced input react component
export function DebouncedInput({
  debounce = 500,
  ...props
}: {
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const { globalFilter, setGlobalFilter } = React.useContext(SearchContext);
  const [value, setValue] = React.useState(globalFilter);

  // React.useEffect(() => {
  //   setValue(initialValue);
  // }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(String(value));
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      type="text"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

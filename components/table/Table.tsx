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
  Column,
  Table,
  ColumnFiltersState,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFacetedRowModel,
} from "@tanstack/react-table";
import { classNames } from "@/utils/functions";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { SearchContext } from "../SearchProvider";
import { Input } from "../ui/input";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Listbox, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";

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
  name: "pl-4 pr-3 font-medium text-gray-900 sm:pl-6",
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <div className="my-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-gray-50">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="p-1">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const Text = flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      );
                      return (
                        <th
                          className={classNames(
                            "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                            columnClass[header.column.id]
                          )}
                          key={header.id}
                        >
                          <div className="flex items-end">
                            {header.column.getCanFilter() ? (
                              <div>
                                <Filter
                                  text={Text}
                                  column={header.column}
                                  table={table}
                                />
                              </div>
                            ) : (
                              <span className="pt-1">{Text}</span>
                            )}
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none py-1 px-2"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
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
                              }[header.column.getIsSorted() as string] ??
                                (header.column.getCanSort() ? (
                                  <ChevronUpDownIcon
                                    width={14}
                                    height={14}
                                    strokeWidth={1.5}
                                  />
                                ) : null)}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className={classNames(
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500 h-10 first:rounded-bl-lg bg-white last:rounded-br-lg",
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

function Filter({
  column,
  table,
  text: Text,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
  text: JSX.Element | React.ReactNode;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  const [selected, setSelected] = React.useState([]);

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <Listbox
      value={selected}
      onChange={(value) => {
        setSelected(value);
        column.setFilterValue(value);
      }}
      multiple
    >
      <div className="relative mt-1">
        <Listbox.Button>
          <span className="block truncate">{Text}</span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 w-fit min-w-[132px] rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <Command>
              <CommandInput
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.stopPropagation();
                  }
                }}
                placeholder={`Search... (${
                  column.getFacetedUniqueValues().size
                })`}
              />
              <CommandEmpty>No attachments found.</CommandEmpty>
              <CommandGroup className="max-h-[232px] overflow-y-scroll">
                {sortedUniqueValues.slice(0, 5000).map((value) => (
                  <CommandItem key={value} value={value}>
                    <Listbox.Option
                      className="w-full font-normal"
                      value={value}
                    >
                      {({ selected }) => (
                        <div className="flex items-center whitespace-nowrap overflow-hidden pr-5">
                          <CheckIcon
                            className={cn(
                              "mr-2 w-4 h-4 opacity-0 flex-shrink-0",
                              selected && "opacity-100"
                            )}
                          />
                          {value}
                        </div>
                      )}
                    </Listbox.Option>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export function GlobalFilterInput({
  debounce = 500,
  ...props
}: {
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  const { globalFilter, setGlobalFilter } = React.useContext(SearchContext);

  return (
    <DebouncedInput
      value={globalFilter ?? ""}
      debounce={debounce}
      onChange={(value) => setGlobalFilter(String(value))}
      placeholder="Search all columns..."
      {...props}
    />
  );
}

// A debounced input react component
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

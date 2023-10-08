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
  Row,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { flushSync } from "react-dom";
import { X } from "lucide-react";

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

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 20,
  });

  return (
    <div className="my-8 flow-root" ref={parentRef}>
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
                {virtualizer.getVirtualItems().map((virtualRow, index) => {
                  const row = rows[virtualRow.index] as Row<T>;
                  return (
                    <tr
                      key={row.id}
                      ref={virtualizer.measureElement}
                      className=""
                    >
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const Filter = React.memo(
  ({
    column,
    table,
    text: Text,
  }: {
    column: Column<any, unknown>;
    table: Table<any>;
    text: JSX.Element | React.ReactNode;
  }) => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [open, setOpen] = React.useState(false);
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id);

    // const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = React.useMemo(
      () =>
        typeof firstValue === "number"
          ? []
          : Array.from(column.getFacetedUniqueValues().keys()).sort(),
      [column.getFacetedUniqueValues()]
    );

    if (typeof firstValue === "number") return Text;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between p-0 py-0 h-min mt-1"
          >
            {Text}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <MultipleSelectCommand
            values={sortedUniqueValues}
            selected={selected}
            setSelected={setSelected}
            column={column}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

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

const MultipleSelectCommand = ({
  values,
  selected,
  setSelected,
  column,
  type = "values",
}: {
  values: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  column: Column<any, unknown>;
  type?: string;
}) => {
  const [value, setValue] = React.useState("");

  return (
    <Command value={value} onValueChange={(value) => setValue(value)}>
      <CommandInput placeholder={`Search ${values.length} ${type}`} />
      <CommandEmpty>No attachments found.</CommandEmpty>
      <CommandGroup className="max-h-[232px] overflow-y-scroll">
        {values.slice(0, 5000).map((item) => (
          <CommandItem
            key={item}
            value={item}
            onSelect={(currentValue) => {
              const alreadyAdded = selected.includes(item);
              const newValues = alreadyAdded
                ? selected.filter((value) => value !== item)
                : [...selected, item];
              flushSync(() => {
                setSelected(newValues);
              });
              column.setFilterValue(newValues);
              setValue(currentValue);
            }}
          >
            <CheckIcon
              className={cn(
                "mr-2 w-4 h-4",
                selected.includes(item) ? "opacity-100" : "opacity-0"
              )}
            />
            {item}
          </CommandItem>
        ))}
      </CommandGroup>
      {selected.length > 0 && (
        <CommandGroup heading="Selected" className="-mt-2">
          {selected.map((item) => (
            <CommandItem
              key={item}
              value={item + "-selected"}
              onSelect={(currentValue) => {
                const newValues = selected.filter((value) => value !== item);
                flushSync(() => {
                  setSelected(newValues);
                });
                column.setFilterValue(newValues);
                setValue(
                  selected.length > 0
                    ? selected.slice(-1)[0] + "-selected"
                    : values[0]
                );
              }}
            >
              <X className={cn("mr-2 w-4 h-4")} />
              {item}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </Command>
  );
};

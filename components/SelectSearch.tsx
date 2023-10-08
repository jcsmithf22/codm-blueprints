"use client";
import React from "react";
import { useMultipleSelection, useCombobox, useSelect } from "downshift";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from "./ui/command";
import { CheckIcon, X } from "lucide-react";
import { flushSync } from "react-dom";

export default function MultipleComboBoxExample() {
  const values = ["test", "test2", "test3"];

  return <MultipleComboBox values={values} />;
}

function getFilteredItems(
  uniqueValueList: string[],
  selectedItems: string[],
  inputValue: string
) {
  const searchTerm = inputValue.toLowerCase();
  return uniqueValueList.filter(
    (value) =>
      !selectedItems.includes(value) && value.toLowerCase().includes(searchTerm)
  );
}

function MultipleComboBox({
  values,
  initialSelectedItems = [],
}: {
  values: string[];
  initialSelectedItems?: string[];
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [selectedItems, setSelectedItems] =
    React.useState(initialSelectedItems);
  const items = React.useMemo(
    () => getFilteredItems(values, selectedItems, inputValue),
    [selectedItems, inputValue, values]
  );
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems || []);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    inputValue,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            const oldSelectedItems = selectedItems || [];
            setSelectedItems([...oldSelectedItems, newSelectedItem]);
            setInputValue("");
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue || "");

          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="w-[592px]">
      <div className="flex flex-col gap-1">
        <label className="w-fit" {...getLabelProps()}>
          Pick some books:
        </label>
        <div className="shadow-sm bg-white inline-flex gap-2 items-center flex-wrap p-1.5">
          <div className="flex gap-0.5 grow">
            <Button
              aria-label="toggle menu"
              type="button"
              {...getToggleButtonProps()}
            >
              &#8595;
            </Button>
          </div>
        </div>
      </div>
      <Input
        placeholder="Best book ever"
        {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
        className="hidden"
      />
      <ul
        className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !(isOpen && items.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen && (
          <>
            <Input
              placeholder="Best book ever"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            {items.map((item, index) => (
              <li
                className={cn(
                  highlightedIndex === index && "bg-blue-300",
                  selectedItem === item && "font-bold",
                  "py-2 px-3 shadow-sm flex flex-col"
                )}
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                <span>{item}</span>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
            {selectedItems.map((selectedItem, index) => {
              return (
                <span
                  className="bg-gray-100 rounded-md px-1 focus:bg-red-400"
                  key={`selected-item-${index}`}
                  {...getSelectedItemProps({
                    selectedItem,
                    index,
                  })}
                >
                  {selectedItem}
                  <span
                    className="px-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedItem(selectedItem);
                    }}
                  >
                    &#10005;
                  </span>
                </span>
              );
            })}
          </>
        )}
      </ul>
    </div>
  );
}

export function MultipleSelectExample() {
  const values = ["test", "test2", "test3"];
  const [inputValue, setInputValue] = React.useState("");

  const initialValues: string[] = [];

  function MultipleSelect() {
    const {
      getSelectedItemProps,
      getDropdownProps,
      addSelectedItem,
      removeSelectedItem,
      selectedItems,
    } = useMultipleSelection({ initialSelectedItems: initialValues });

    const items = React.useMemo(
      () => getFilteredItems(values, selectedItems, inputValue),
      [values, selectedItems, inputValue]
    );

    const {
      isOpen,
      selectedItem,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      highlightedIndex,
      getItemProps,
    } = useSelect({
      selectedItem: null,
      defaultHighlightedIndex: 0, // after selection, highlight the first item.
      items,
      stateReducer: (state, actionAndChanges) => {
        const { changes, type } = actionAndChanges;
        console.log(changes);
        console.log(type);
        console.log(state);
        switch (type) {
          case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
          case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
          case useSelect.stateChangeTypes.ItemClick:
            // case useSelect.stateChangeTypes.ToggleButtonKeyDownCharacter:
            return {
              ...changes,
              isOpen: true, // keep the menu open after selection.
              highlightedIndex: 0, // with the first option highlighted.
            };
          default:
            break;
        }
        return changes;
      },
      onStateChange: ({ type, selectedItem: newSelectedItem, isOpen }) => {
        console.log("nothing");
        switch (type) {
          case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
          case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
          case useSelect.stateChangeTypes.ItemClick:
          case useSelect.stateChangeTypes.ToggleButtonBlur:
            if (newSelectedItem) {
              addSelectedItem(newSelectedItem);
            }
            break;
          default:
            break;
        }
      },
    });

    return (
      <div className="w-[592px]">
        <div className="flex flex-col gap-1">
          <label className="w-fit" {...getLabelProps()}>
            Pick some books:
          </label>
          <div className="shadow-sm bg-white inline-flex gap-2 items-center flex-wrap p-1.5 border-2 focus-within:border-gray-400">
            {selectedItems.map(function renderSelectedItem(
              selectedItemForRender,
              index
            ) {
              return (
                <span
                  className="bg-gray-100 rounded-md px-1 focus:bg-red-400"
                  key={`selected-item-${index}`}
                  {...getSelectedItemProps({
                    selectedItem: selectedItemForRender,
                    index,
                  })}
                >
                  {selectedItemForRender}
                  <span
                    className="px-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedItem(selectedItemForRender);
                    }}
                  >
                    &#10005;
                  </span>
                </span>
              );
            })}
            <div
              className="px-2 py-1 outline-2 outline-gray-400 cursor-pointer focus:bg-gray-200"
              {...getToggleButtonProps(
                getDropdownProps({ preventKeyAction: isOpen })
              )}
            >
              Pick some books &#8595;
            </div>
          </div>
        </div>
        <ul
          className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
            !(isOpen && items.length) && "hidden"
          }`}
          {...getMenuProps()}
          onKeyDown={() => {}}
        >
          {isOpen && (
            <>
              <Input
                type="text"
                placeholder={`Search... (${values.length})`}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />
              {items.map((item, index) => (
                <li
                  className={cn(
                    highlightedIndex === index && "bg-blue-300",
                    selectedItem === item && "font-bold",
                    "py-2 px-3 shadow-sm flex flex-col"
                  )}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <span>{item}</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    );
  }
  return <MultipleSelect />;
}

export function TestCommand() {
  const [names, setNames] = React.useState<string[]>([]);
  const [value, setValue] = React.useState("");
  const testValues = ["test", "test2", "test3"];

  const lastValue = names.slice(-1)[0];

  console.count("render");

  return (
    <Command value={value} onValueChange={(value) => setValue(value)}>
      <CommandInput placeholder={`Search ${testValues.length} attachments`} />
      <CommandEmpty>No attachments found.</CommandEmpty>
      <CommandGroup className="max-h-[232px] overflow-y-scroll">
        {testValues.map((item) => (
          <CommandItem
            key={item}
            value={item}
            onSelect={(currentValue) => {
              flushSync(() => {
                const alreadyAdded = names.includes(currentValue);
                if (alreadyAdded) {
                  setNames(names.filter((name) => name !== currentValue));
                  return;
                }
                setNames([...names, currentValue]);
              });
              setValue(currentValue);
            }}
          >
            <CheckIcon
              className={cn(
                "mr-2 w-4 h-4",
                names.includes(item) ? "opacity-100" : "opacity-0"
              )}
            />
            {item}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandGroup heading="Selected">
        {names.map((name) => (
          <CommandItem
            key={name}
            value={name + "-selected"}
            onSelect={(currentValue) => {
              setNames(
                names.filter((name) => name !== currentValue.split("-")[0])
              );
            }}
          >
            {name}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}

import React from "react";
import type { AttachmentName, Attachment, Model } from "@/types/types";
import { classNames } from "@/utils/functions";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";

export const NameSelect = React.memo(
  ({
    attachment_names,
    setName,
    name,
  }: {
    attachment_names: AttachmentName[] | null | undefined;
    setName: (name: string) => void;
    name: number;
  }) => {
    const [open, setOpen] = React.useState(false);
    // potentially memoize this
    // if data is not server rendered, this will be undefined
    const value = attachment_names?.find((item) => item.id === name)?.name;
    const id = React.useId();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    return (
      <div className="">
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor={`${id}-name`}
        >
          Name
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              id={`${id}-name`}
              variant="outline"
              type="button"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mt-2"
            >
              {value ? value : "Select Name..."}
              <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0"
            style={{
              width: buttonRef.current?.getBoundingClientRect().width,
            }}
          >
            <Command>
              <CommandInput
                placeholder={`Search ${attachment_names?.length} attachments`}
              />
              <CommandEmpty>No attachments found.</CommandEmpty>
              <CommandGroup className="max-h-[232px] overflow-y-scroll">
                {attachment_names?.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={(currentValue) => {
                      setName(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 w-4 h-4",
                        name === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

export const ModelSelect = React.memo(
  ({
    model,
    models,
    setModel,
  }: {
    model: number;
    models: Model[] | null | undefined;
    setModel: (model: string) => void;
  }) => {
    const [open, setOpen] = React.useState(false);
    // potentially memoize this
    // if data is not server rendered, this will be undefined
    const value = models?.find((item) => item.id === model)?.name;
    const id = React.useId();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    return (
      <div className="">
        <label
          htmlFor={`${id}-model`}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Model
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              id={`${id}-model`}
              variant="outline"
              type="button"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mt-2"
            >
              {value ? value : "Select Name..."}
              <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            style={{
              width: buttonRef.current?.getBoundingClientRect().width,
            }}
          >
            <Command>
              <CommandInput placeholder={`Search ${models?.length} models`} />
              <CommandEmpty>No attachments found.</CommandEmpty>
              <CommandGroup className="max-h-[232px] overflow-y-scroll">
                {models?.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={(currentValue) => {
                      setModel(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 w-4 h-4",
                        model === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

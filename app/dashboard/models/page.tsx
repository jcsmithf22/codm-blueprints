import React from "react";
import Link from "next/link";
import ModelRows from "@/components/table/ModelRows";
import { SearchProvider } from "@/components/SearchProvider";
import { DebouncedInput } from "@/components/table/Table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ServerComponent() {
  return (
    <SearchProvider>
      <div className="fixed top-0 left-0 md:left-72 right-0 z-10 p-4">
        <div className="p-4 flex lg:items-center flex-col lg:flex-row gap-8 rounded-lg bg-white border border-gray-200 shadow">
          <div className="sm:flex-grow flex-shrink-0">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Models
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all models in the database.
            </p>
          </div>
          <div className="flex gap-x-2 justify-between w-full lg:justify-end">
            <DebouncedInput
              placeholder="Search all columns..."
              className="w-full sm:w-72 bg-gray-50"
            />
            <Link
              href="/dashboard/models/create"
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-shrink-0"
              )}
            >
              Add attachment
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 pt-8 h-screen overflow-y-scroll">
        <div className="px-4 sm:px-6 lg:px-8 lg:pt-14 pt-32">
          <ModelRows />
        </div>
      </div>
    </SearchProvider>
  );
}

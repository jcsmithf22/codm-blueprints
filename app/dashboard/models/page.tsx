import React from "react";
import Link from "next/link";
import ModelRows from "@/components/table/ModelRows";
import { SearchProvider } from "@/components/SearchProvider";
import { DebouncedInput } from "@/components/table/Table";

export default function ServerComponent() {
  return (
    <SearchProvider>
      <div className="bg-gray-100 pt-8 h-screen overflow-y-scroll">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex lg:items-center flex-col lg:flex-row gap-8">
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
                className="block w-full sm:w-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Search all columns..."
              />
              <Link
                href="/dashboard/models/create"
                className="flex-shrink-0 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Add model
              </Link>
            </div>
          </div>
          <ModelRows />
        </div>
      </div>
    </SearchProvider>
  );
}

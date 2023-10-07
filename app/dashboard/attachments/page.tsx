import Link from "next/link";
import AttachmentRows from "@/components/table/AttachmentRows";
import { SearchProvider } from "@/components/SearchProvider";
import { DebouncedInput } from "@/components/table/Table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AttachmentsPage() {
  return (
    <SearchProvider>
      <div className="bg-gray-100 pt-8 h-screen overflow-y-scroll">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex lg:items-center flex-col lg:flex-row gap-8">
            <div className="sm:flex-grow flex-shrink-0">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Attachments
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all attachments in the database.
              </p>
            </div>
            <div className="flex gap-x-2 justify-between w-full lg:justify-end">
              <DebouncedInput
                className="w-full sm:w-72"
                placeholder="Search all columns..."
              />
              <Link
                href="/dashboard/attachments/create"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "flex-shrink-0"
                )}
              >
                Add attachment
              </Link>
            </div>
          </div>
          <AttachmentRows />
        </div>
      </div>
    </SearchProvider>
  );
}

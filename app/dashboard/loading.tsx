"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoadingRows from "@/components/table/LoadingRows";
import React from "react";

const data: { [key: string]: Array<string | React.JSX.Element> } = {
  types: [
    "Types",
    "attachment types",
    "type",
    <LoadingRows columns={["Name", "Type"]} />,
  ],

  models: [
    "Models",
    "models",
    "model",
    <LoadingRows columns={["Name", "Type", "Attachments"]} />,
  ],
  attachments: [
    "Attachments",
    "attachments",
    "attachment",
    <LoadingRows columns={["Name", "Type", "Model", "Characteristics"]} />,
  ],
};

const Loading = () => {
  const pathname = usePathname();
  const text = pathname.split("/").pop() || "";
  const [title, plural, singular, Loading] = data[text];

  return (
    <>
      <div className="fixed top-0 left-0 md:left-72 right-0 z-10 p-4">
        <div className="p-4 flex lg:items-center flex-col lg:flex-row gap-8 rounded-lg bg-white border border-gray-200 shadow">
          <div className="sm:flex-grow flex-shrink-0">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all {plural} in the database.
            </p>
          </div>
          <div className="flex gap-x-2 justify-between w-full lg:justify-end">
            <Link
              href="/dashboard/types/create"
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-shrink-0"
              )}
            >
              Add {singular}
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 pt-8 h-screen overflow-y-scroll">
        <div className="px-4 sm:px-6 lg:px-8 lg:pt-14 pt-32">{Loading}</div>
      </div>
    </>
  );
};

export default Loading;

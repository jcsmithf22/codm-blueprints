"use client";
import React, { Suspense } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";

import { Database } from "@/types/supabase";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAttachments } from "@/utils/functions";
import { JoinedAttachment } from "@/types/types";
import LoadingRows from "./LoadingRows";
import { ColumnDef } from "@tanstack/react-table";

const Loading = () => {
  return <LoadingRows columns={["Name", "Type", "Model", "Characteristics"]} />;
};

// import { Table } from "./Table";
const Table = dynamic(() => import("./Table").then((mod) => mod.Table), {
  loading: Loading,
}) as <T>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T, any>[];
}) => React.JSX.Element;
// const Table = dynamic()

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<JoinedAttachment>();

const columns = [
  // id column
  // columnHelper.accessor("id", {
  //   id: "id",
  //   header: "ID",
  // }),
  columnHelper.accessor((row) => row.attachment_names?.name, {
    id: "name",
    header: "Name",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor((row) => row.attachment_names?.type, {
    id: "type",
    header: "Type",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor((row) => row.models?.name, {
    id: "model",
    header: "Model",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("characteristics", {
    header: "Characteristics",
    cell: (info) => (
      <>
        {info.getValue().pros.map((pro) => (
          <p className="text-green-600 flex gap-x-1 items-center" key={pro}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
              />
            </svg>
            {pro}
          </p>
        ))}
        {info.getValue().cons.map((con) => (
          <p className="text-red-600 flex gap-x-1 items-center" key={con}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              />
            </svg>
            {con}
          </p>
        ))}
      </>
    ),
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("id", {
    id: "actions",
    cell: (item) => (
      <Link
        href={`/dashboard/attachments/edit/${item.getValue()}`}
        className="text-blue-600 hover:text-blue-900 mr-2"
      >
        Edit
        <span className="sr-only">, {item.row.getValue("name")}</span>
      </Link>
    ),
    header: () => <span className="sr-only">Edit</span>,
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
];

export default function AttachmentRows() {
  const supabase = createClientComponentClient<Database>();
  const { data, isPending } = useQuery({
    queryKey: ["attachments"],
    queryFn: () => getAttachments(supabase),
  });

  if (isPending) {
    return (
      // <LoadingRows columns={["Name", "Type", "Model", "Characteristics"]} />
      <Loading />
    );
  }

  if (!data) {
    return "Error: Table does not exist.";
  }

  return <Table<JoinedAttachment> columns={columns} data={data} />;
}

"use client";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/supabase";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAttachments } from "@/utils/functions";
import { JoinedAttachment } from "@/types/types";
import LoadingRows from "./LoadingRows";

import { Table } from "./Table";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<JoinedAttachment>();

const columns = [
  // id column
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
  }),
  columnHelper.accessor((row) => row.attachment_names?.name, {
    id: "name",
    header: "Name",
  }),
  columnHelper.accessor((row) => row.attachment_names?.type, {
    header: "Type",
  }),
  columnHelper.accessor((row) => row.models?.name, {
    header: "Model",
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
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <Link
        href={`/dashboard/attachments/edit/${props.row.getValue("id")}`}
        className="text-blue-600 hover:text-blue-900"
      >
        Edit
        <span className="sr-only">, {props.row.getValue("name")}</span>
      </Link>
    ),
    header: () => <span className="sr-only">Edit</span>,
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
      <LoadingRows
        columns={["ID", "Name", "Type", "Model", "Characteristics"]}
      />
    );
  }

  if (!data) {
    return "Error: Table does not exist.";
  }

  return <Table<JoinedAttachment> columns={columns} data={data} />;
}

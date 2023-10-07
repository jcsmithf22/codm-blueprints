"use client";
import React from "react";
import { AttachmentName } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/supabase";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/utils/functions";
import LoadingRows from "./LoadingRows";

import { Table } from "./Table";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<AttachmentName>();

const columns = [
  // id column
  // columnHelper.accessor("id", {
  //   id: "id",
  //   header: "ID",
  // }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("id", {
    id: "actions",
    cell: (item) => (
      <Link
        href={`/dashboard/types/edit/${item.getValue()}`}
        className="text-blue-600 hover:text-blue-900"
      >
        Edit
        <span className="sr-only">, {item.row.getValue("name")}</span>
      </Link>
    ),
    header: () => <span className="sr-only">Edit</span>,
  }),
];

export default function TypeRows() {
  const supabase = createClientComponentClient<Database>();
  const {
    data,
    isPending,
    // isError,
  } = useQuery({
    queryKey: ["types"],
    queryFn: () => getItems<AttachmentName>(supabase, "attachment_names"),
    // initialData: initialTypes,
  });

  // refactor
  if (isPending) {
    return <LoadingRows columns={["Name", "Type"]} />;
    // return "Loading...";
  }

  if (!data) {
    return "Error: Table does not exist.";
  }

  return <Table<AttachmentName> columns={columns} data={data} />;
}

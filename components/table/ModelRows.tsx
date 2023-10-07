"use client";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/supabase";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAttachments, getItems } from "@/utils/functions";
import { Model, CombinedModelsAttachments } from "@/types/types";
import LoadingRows from "./LoadingRows";

import { Table } from "./Table";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<CombinedModelsAttachments>();

const columns = [
  // id column
  // columnHelper.accessor("id", {
  //   id: "id",
  //   header: "ID",
  // }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("type", {
    id: "type",
    header: "Type",
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("attachments", {
    id: "attachments",
    header: "Attachments",
    cell: (info) =>
      info.getValue().map((attachment) => (
        <p className="" key={attachment.id}>
          {attachment.attachment_names?.name}
        </p>
      )),
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("id", {
    id: "actions",
    cell: (item) => (
      <Link
        href={`/dashboard/models/edit/${item.getValue()}`}
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

export default function ModelRows() {
  const supabase = createClientComponentClient<Database>();
  const { data: attachments, isPending: isPendingAttachments } = useQuery({
    queryKey: ["attachments"],
    queryFn: () => getAttachments(supabase),
  });
  const { data: models, isPending: isPendingModels } = useQuery({
    queryKey: ["models"],
    queryFn: () => getItems<Model>(supabase, "models"),
  });

  if (isPendingAttachments || isPendingModels) {
    {
      return <LoadingRows columns={["Name", "Type", "Attachments"]} />;
    }
  }

  if (!models || !attachments) {
    return "Error: Tables do not exist";
  }

  const data = models?.map((model) => ({
    ...model,
    attachments: attachments?.filter(
      (attachment) => attachment.models?.id === model.id
    ),
  }));

  return <Table<CombinedModelsAttachments> columns={columns} data={data} />;
}

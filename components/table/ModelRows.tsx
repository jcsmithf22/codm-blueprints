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
  columnHelper.accessor("id", {
    id: "id",
    header: "ID",
  }),
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("attachments", {
    header: "Attachments",
    cell: (info) =>
      info.getValue().map((attachment) => (
        <p className="" key={attachment.id}>
          {attachment.attachment_names?.name}
        </p>
      )),
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <Link
        href={`/dashboard/models/edit/${props.row.getValue("id")}`}
        className="text-blue-600 hover:text-blue-900"
      >
        Edit
        <span className="sr-only">, {props.row.getValue("name")}</span>
      </Link>
    ),
    header: () => <span className="sr-only">Edit</span>,
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
      return <LoadingRows columns={["ID", "Name", "Type", "Attachments"]} />;
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

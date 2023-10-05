"use client";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/supabase";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAttachments, getItems } from "@/utils/functions";
import { Model } from "@/types/types";
import LoadingRows from "./LoadingRows";

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
    return <LoadingRows columnNumber={4} />;
  }

  return models?.map((model) => (
    <tr key={model.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {model.id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {model.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {model.type}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="max-h-24 overflow-y-scroll">
          {attachments
            ?.filter((attachment) => attachment.models?.id === model.id)
            .map((attachment) => (
              <p className="" key={attachment.id}>
                {attachment.attachment_names?.name}
              </p>
            ))}
        </div>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Link
          href={`/dashboard/models/edit/${model.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
          <span className="sr-only">, {model.name}</span>
        </Link>
      </td>
    </tr>
  ));
}

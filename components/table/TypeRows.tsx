"use client";
import React from "react";
import { AttachmentName } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/supabase";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/utils/functions";
import LoadingRows from "./LoadingRows";

export default function TypeRows() {
  //   {
  //   initialTypes,
  // }: {
  //   initialTypes: AttachmentName[] | null;
  // }
  const supabase = createClientComponentClient<Database>();
  const {
    data: types,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["types"],
    queryFn: () => getItems<AttachmentName>(supabase, "attachment_names"),
    // initialData: initialTypes,
  });

  if (isPending) {
    return <LoadingRows columnNumber={3} />;
  }

  return types?.map((type) => (
    <tr key={type.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {type.id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {type.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {type.type}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Link
          href={`/dashboard/types/edit/${type.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
          <span className="sr-only">, {type.name}</span>
        </Link>
      </td>
    </tr>
  ));
}

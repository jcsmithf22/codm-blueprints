"use client";
import React from "react";
import { AttachmentName } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useEffect } from "react";
import { Database } from "@/types/supabase";
import Link from "next/link";

export default function TypeRows({
  serverData,
}: {
  serverData: AttachmentName[];
}) {
  const supabase = createClientComponentClient<Database>();
  const [types, setTypes] = React.useState(serverData);

  useEffect(() => {
    setTypes(serverData);
  }, [serverData]);

  useEffect(() => {
    const attachmentNames = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attachment_names" },
        (payload) => {
          console.log("insert");
          const newPayload = payload.new as AttachmentName;
          setTypes((types) => [...types, newPayload]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "attachment_names" },
        (payload) => {
          console.log("update");
          const newPayload = payload.new as AttachmentName;
          setTypes((types) =>
            types.map((type) => {
              if (type.id === newPayload.id) {
                return newPayload;
              }
              return type;
            })
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "attachment_names" },
        (payload) => {
          console.log("delete");
          const oldPayload = payload.old as AttachmentName;
          setTypes((types) =>
            types.filter((type) => type.id !== oldPayload.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attachmentNames);
    };
  }, [serverData]);
  // return <pre>{JSON.stringify(serverData, null, 2)}</pre>;

  {
    return (
      <>
        {types.map((type) => (
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
        ))}
      </>
    );
  }
}

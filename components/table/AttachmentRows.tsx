"use client";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useEffect } from "react";
import { Database } from "@/types/supabase";
import Link from "next/link";
import { JoinedAttachment } from "@/app/dashboard/attachments/page";
import { Attachment } from "@/types/types";

export default function AttachmentRows({
  serverData,
}: {
  serverData: JoinedAttachment[];
}) {
  const supabase = createClientComponentClient<Database>();
  const [attachments, setAttachments] = React.useState(serverData);

  useEffect(() => {
    setAttachments(serverData);
  }, [serverData]);

  useEffect(() => {
    const attachmentsChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attachments" },
        async (payload) => {
          console.log("insert");
          const newPayload = payload.new as Attachment;
          const { data: joinedData } = await supabase
            .from("attachments")
            .select(`attachment_names (name, type), models (name)`)
            .eq("id", newPayload.id!)
            .single();
          const joinedPayload = {
            ...newPayload,
            ...joinedData,
          } as JoinedAttachment;
          setAttachments((attachment) => [...attachment, joinedPayload]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "attachments" },
        async (payload) => {
          console.log("update");
          const newPayload = payload.new as JoinedAttachment;
          const { data: joinedData } = await supabase
            .from("attachments")
            .select(`attachment_names (name, type), models (name)`)
            .eq("id", newPayload.id!)
            .single();
          const joinedPayload = {
            ...newPayload,
            ...joinedData,
          } as JoinedAttachment;
          setAttachments((types) =>
            types.map((type) => {
              if (type.id === newPayload.id) {
                return joinedPayload;
              }
              return type;
            })
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "attachments" },
        (payload) => {
          console.log("delete");
          const oldPayload = payload.old as JoinedAttachment;
          setAttachments((types) =>
            types.filter((type) => type.id !== oldPayload.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attachmentsChannel);
    };
  }, [serverData]);
  // return <pre>{JSON.stringify(serverData, null, 2)}</pre>;

  {
    return (
      <>
        {attachments?.map((attachment) => (
          <tr key={attachment.id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {attachment.id}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {/* {
                            attachment_names?.find(
                              (name) => name.id === attachment.type
                            )?.name
                          } */}
              {attachment.attachment_names?.name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {/* {
                            attachment_names?.find(
                              (name) => name.id === attachment.type
                            )?.type
                          } */}
              {attachment.attachment_names?.type}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {/* {
                            models?.find(
                              (model) => model.id === attachment.model
                            )?.name
                          } */}
              {attachment.models?.name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {attachment.characteristics.pros.map((pro) => (
                <p
                  className="text-green-600 flex gap-x-1 items-center"
                  key={pro}
                >
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
              {attachment.characteristics.cons.map((con) => (
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
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <Link
                href={`/dashboard/attachments/edit/${attachment.id}`}
                className="text-blue-600 hover:text-blue-900"
              >
                Edit
                <span className="sr-only">
                  {/* {
                                attachment_names?.find(
                                  (name) => name.id === attachment.type
                                )?.name
                              } */}
                  {attachment.attachment_names?.name}
                </span>
              </Link>
            </td>
          </tr>
        ))}
      </>
    );
  }
}

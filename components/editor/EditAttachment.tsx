"use client";
import React from "react";
import { produce } from "immer";
import type { Attachment, AttachmentName, Model } from "@/types/types";
import { useRouter } from "next/navigation";
import { NameSelect, ModelSelect } from "./attachments/Select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { getItems, getItem, updateItem, deleteItem } from "@/utils/functions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export default function EditAttachment({
  attachmentId,
}: {
  attachmentId: string;
}) {
  const supabase = createClientComponentClient<Database>();
  const { data: attachment } = useQuery({
    queryKey: ["attachments", attachmentId],
    queryFn: () => getItem<Attachment>(supabase, "attachments", attachmentId),
  });
  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: () => getItems<Model>(supabase, "models"),
  });
  const { data: attachment_names } = useQuery({
    queryKey: ["types"],
    queryFn: () => getItems<AttachmentName>(supabase, "attachment_names"),
  });
  const [formData, setFormData] = React.useState<Attachment | undefined>(
    attachment
  );
  const id = React.useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setFormData(attachment);
  }, [attachment]);

  const updateMutation = useMutation({
    mutationFn: (updatedData: Attachment) => {
      return updateItem<Attachment>(
        supabase,
        "attachments",
        attachmentId,
        updatedData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      // await supabase.from("attachment_names").delete().eq("id", attachmentId);
      return deleteItem(supabase, "attachments", attachmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"], exact: true });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    if (!formData) return;
    const filteredState = produce(formData, (draft) => {
      draft.characteristics.pros = draft.characteristics.pros.filter(
        (pro) => pro !== ""
      );
      draft.characteristics.cons = draft.characteristics.cons.filter(
        (con) => con !== ""
      );
    });

    updateMutation.mutate(filteredState);
  };

  const handleDelete = async () => {
    deleteMutation.mutate();
  };

  const setName = React.useCallback((name: string) => {
    setFormData((formData) => {
      if (!formData) return undefined;
      return {
        ...formData,
        type: parseInt(name),
      };
    });
  }, []);

  const setModel = React.useCallback((model: string) => {
    setFormData((formData) => {
      if (!formData) return undefined;
      return {
        ...formData,
        model: parseInt(model),
      };
    });
  }, []);
  return (
    <form action={handleSubmit} className="">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Attachment Editor
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Edit an existing attachment from the database.
      </p>
      <div className="mt-10 flex flex-col gap-y-6">
        <ModelSelect
          model={formData ? formData.model : null}
          models={models}
          setModel={setModel}
        />

        <NameSelect
          attachment_names={attachment_names}
          setName={setName}
          name={formData ? formData.type : null}
        />

        <div className="">
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor={`${id}-pro-0`}
          >
            Pros
          </label>
          <div className="mt-2">
            {formData?.characteristics.pros.map((pro, i) => (
              <div className="flex gap-x-2 mb-2" key={i}>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  type="text"
                  id={`${id}-pro-${i}`}
                  name={`pro-${i}`}
                  value={pro}
                  onChange={(e) => {
                    setFormData(
                      produce(formData, (draft) => {
                        draft.characteristics.pros[i] = e.target.value;
                      })
                    );
                  }}
                />
                <button
                  className="rounded-md bg-white px-1.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={() => {
                    setFormData(
                      produce(formData, (draft) => {
                        draft.characteristics.pros.splice(i, 1);
                      })
                    );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              if (!formData) return;
              setFormData(
                produce(formData, (draft) => {
                  draft.characteristics.pros.push("");
                })
              );
            }}
          >
            New
          </button>
        </div>

        <div className="">
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor={`${id}-con-0`}
          >
            Cons
          </label>
          <div className="mt-2">
            {formData?.characteristics.cons.map((con, i) => (
              <div className="flex gap-x-2 mb-2" key={i}>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  type="text"
                  id={`${id}-con-${i}`}
                  name={`con-${i}`}
                  value={con}
                  onChange={(e) => {
                    setFormData(
                      produce(formData, (draft) => {
                        draft.characteristics.cons[i] = e.target.value;
                      })
                    );
                  }}
                />
                <button
                  className="rounded-md bg-white px-1.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={() => {
                    setFormData(
                      produce(formData, (draft) => {
                        draft.characteristics.cons.splice(i, 1);
                      })
                    );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              if (!formData) return;
              setFormData(
                produce(formData, (draft) => {
                  draft.characteristics.cons.push("");
                })
              );
            }}
          >
            New
          </button>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}

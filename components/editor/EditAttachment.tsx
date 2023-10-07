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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { flushSync } from "react-dom";

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

  const currentConInput = React.useRef<HTMLInputElement>(null);
  const currentProInput = React.useRef<HTMLInputElement>(null);

  const lastCon = formData ? formData.characteristics.cons.length - 1 : -1;
  const lastPro = formData ? formData.characteristics.pros.length - 1 : -1;

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

  const attachmentNameIndex = React.useMemo(
    () =>
      attachment_names?.reduce((acc, attachment) => {
        acc[attachment.name.toLowerCase()] = attachment;
        return acc;
      }, {} as { [key: string]: (typeof attachment_names)[0] }),
    [attachment_names]
  );

  const modelNameIndex = React.useMemo(
    () =>
      models?.reduce((acc, model) => {
        acc[model.name.toLowerCase()] = model;
        return acc;
      }, {} as { [key: string]: (typeof models)[0] }),
    [models]
  );

  const setName = React.useCallback((name: string) => {
    // find amore efficient way to do this
    const attachmentId = attachmentNameIndex?.[name.toLowerCase()]?.id || -1;
    setFormData((formData) => {
      if (!formData) return undefined;
      return {
        ...formData,
        type: attachmentId,
      };
    });
  }, []);

  const setModel = React.useCallback((model: string) => {
    const modelId = modelNameIndex?.[model.toLowerCase()]?.id || -1;
    setFormData((formData) => {
      if (!formData) return undefined;
      return {
        ...formData,
        model: modelId,
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
          model={formData ? formData.model : -1}
          models={models}
          setModel={setModel}
        />

        <NameSelect
          attachment_names={attachment_names}
          setName={setName}
          name={formData ? formData.type : -1}
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
                <Input
                  ref={i === lastPro ? currentProInput : undefined}
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
                <Button
                  className="px-2"
                  variant="outline"
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
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={() => {
              if (!formData) return;
              flushSync(() => {
                setFormData(
                  produce(formData, (draft) => {
                    draft.characteristics.pros.push("");
                  })
                );
              });
              currentProInput.current?.focus();
            }}
          >
            New
          </Button>
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
                <Input
                  ref={i === lastCon ? currentConInput : undefined}
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
                <Button
                  className="px-2"
                  variant="outline"
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
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              if (!formData) return;
              flushSync(() => {
                setFormData(
                  produce(formData, (draft) => {
                    draft.characteristics.cons.push("");
                  })
                );
              });
              currentConInput.current?.focus();
            }}
          >
            New
          </Button>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between w-full">
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
        <div className="space-x-2">
          <Button
            variant="ghost"
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
}

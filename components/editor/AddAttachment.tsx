"use client";
import React from "react";
import { produce } from "immer";
import type { Attachment, AttachmentName, Model } from "@/types/types";
import { useRouter } from "next/navigation";
import { NameSelect, ModelSelect } from "./attachments/Select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { getItems, insertItem } from "@/utils/functions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { flushSync } from "react-dom";

export default function AddAttachment() {
  const supabase = createClientComponentClient<Database>();
  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: () => getItems<Model>(supabase, "models"),
  });
  const { data: attachment_names } = useQuery({
    queryKey: ["types"],
    queryFn: () => getItems<AttachmentName>(supabase, "attachment_names"),
  });
  const [formData, setFormData] = React.useState<Attachment>({
    type: -1,
    model: -1,
    characteristics: {
      pros: [],
      cons: [],
    },
  });
  const id = React.useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentConInput = React.useRef<HTMLInputElement>(null);
  const currentProInput = React.useRef<HTMLInputElement>(null);

  const lastCon = formData.characteristics.cons.length - 1;
  const lastPro = formData.characteristics.pros.length - 1;

  React.useEffect(() => {
    currentConInput.current?.focus();
  }, [lastCon]);

  React.useEffect(() => {
    currentProInput.current?.focus();
  }, [lastPro]);

  const newMutation = useMutation({
    mutationFn: (newData: Attachment) => {
      return insertItem<Attachment>(supabase, "attachments", newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    const filteredState = produce(formData, (draft) => {
      draft.characteristics.pros = draft.characteristics.pros.filter(
        (pro) => pro !== ""
      );
      draft.characteristics.cons = draft.characteristics.cons.filter(
        (con) => con !== ""
      );
    });

    newMutation.mutate(filteredState);
  };

  const setName = React.useCallback((name: string) => {
    const attachmentId =
      attachment_names?.find((item) => item.name.toLowerCase() === name)?.id ||
      -1;
    setFormData((formData) => ({
      ...formData,
      type: attachmentId,
    }));
  }, []);

  const setModel = React.useCallback((model: string) => {
    const modelId =
      models?.find((item) => item.name.toLowerCase() === model)?.id || -1;
    setFormData((formData) => ({
      ...formData,
      model: modelId,
    }));
  }, []);

  return (
    <form action={handleSubmit} className="">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Attachment Editor
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Add a new attachment to the database.
      </p>
      <div className="mt-10 flex flex-col gap-y-6">
        <ModelSelect
          model={formData.model}
          models={models}
          setModel={setModel}
        />

        <NameSelect
          name={formData.type}
          attachment_names={attachment_names}
          setName={setName}
        />

        <div className="">
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor={`${id}-pro-0`}
          >
            Pros
          </label>
          <div className="mt-2">
            {formData.characteristics.pros.map((pro, i) => (
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
            {formData.characteristics.cons.map((con, i) => (
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
      <div className="mt-6 flex items-center justify-end gap-x-2 w-full">
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
    </form>
  );
}

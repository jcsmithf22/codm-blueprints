"use client";
import React from "react";
import { produce } from "immer";
import type { Attachment, AttachmentName, Model } from "@/types/types";
import { useRouter } from "next/navigation";
import { NameSelect, ModelSelect } from "./attachments/Select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import {
  getItems,
  getItem,
  updateItem,
  deleteItem,
  insertItem,
} from "@/utils/functions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

type Action =
  | {
      type: "UpdateModel" | "UpdateType";
      value: number;
    }
  | {
      type: "UpdatePros" | "UpdateCons";
      value: string;
      index: number;
    }
  | {
      type: "AddPro" | "AddCon";
    }
  | {
      type: "RemovePro" | "RemoveCon";
      index: number;
    }
  | {
      type: "Reset";
      value: Attachment;
    };

const reducer = (state: Attachment, action: Action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "UpdateModel": {
        draft.model = action.value;
        break;
      }
      case "UpdateType": {
        draft.type = action.value;
        break;
      }
      case "UpdatePros": {
        draft.characteristics.pros[action.index] = action.value;
        break;
      }
      case "UpdateCons": {
        draft.characteristics.cons[action.index] = action.value;
        break;
      }
      case "AddPro": {
        draft.characteristics.pros.push("");
        break;
      }
      case "AddCon": {
        draft.characteristics.cons.push("");
        break;
      }
      case "RemovePro": {
        draft.characteristics.pros.splice(action.index, 1);
        break;
      }
      case "RemoveCon": {
        draft.characteristics.cons.splice(action.index, 1);
        break;
      }
      case "Reset": {
        return action.value;
      }
    }
  });
};

type Error = {
  type?: string;
  model?: string;
  server?: string;
};

export default function AttachmentEditor({
  attachmentId,
}: {
  attachmentId?: string;
}) {
  const supabase = createClientComponentClient<Database>();
  const { data: attachment } = useQuery({
    queryKey: ["attachments", attachmentId],
    queryFn: () => getItem<Attachment>(supabase, "attachments", attachmentId!),
    enabled: !!attachmentId,
  });
  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: () => getItems<Model>(supabase, "models"),
  });
  const { data: attachment_names } = useQuery({
    queryKey: ["types"],
    queryFn: () => getItems<AttachmentName>(supabase, "attachment_names"),
  });
  // const [formData, setFormData] = React.useState<Attachment>(
  const [formData, dispatch] = React.useReducer(
    reducer,
    attachment || {
      type: -1,
      model: -1,
      characteristics: {
        pros: [],
        cons: [],
      },
    }
  );

  const [error, setError] = React.useState<Error | null>(null);

  const id = React.useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  // ref for the last added input in the pros and cons
  const currentConInput = React.useRef<HTMLInputElement>(null);
  const currentProInput = React.useRef<HTMLInputElement>(null);

  // index of the last item in the pros and cons arrays
  const lastCon = formData ? formData.characteristics.cons.length - 1 : -1;
  const lastPro = formData ? formData.characteristics.pros.length - 1 : -1;

  // updates formData when the attachment is loaded
  React.useEffect(() => {
    if (!attachment) return;
    dispatch({ type: "Reset", value: attachment });
  }, [attachment]);

  const updateMutation = useMutation({
    mutationFn: ({
      updatedData,
      id,
    }: {
      updatedData: Attachment;
      id: string;
    }) => {
      return updateItem<Attachment>(supabase, "attachments", id, updatedData);
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
    mutationFn: (id: string) => {
      return deleteItem(supabase, "attachments", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"], exact: true });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
    const submitErrors: Error = {};
    if (formData.type === -1) {
      submitErrors.type = "Please select a type";
    }
    if (formData.model === -1) {
      submitErrors.model = "Please select a model";
    }
    if (Object.keys(submitErrors).length > 0) {
      setError(submitErrors);
      return;
    }
    const filteredState = produce(formData, (draft) => {
      draft.characteristics.pros = draft.characteristics.pros.filter(
        (pro) => pro !== ""
      );
      draft.characteristics.cons = draft.characteristics.cons.filter(
        (con) => con !== ""
      );
    });

    if (!attachmentId) {
      newMutation.mutate(filteredState);
      return;
    }

    updateMutation.mutate({ updatedData: filteredState, id: attachmentId });
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
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
    const attachmentId = attachmentNameIndex?.[name.toLowerCase()]?.id || -1;
    setError((error) => {
      if (error?.type) {
        return { ...error, type: undefined };
      }
      return error;
    });
    dispatch({ type: "UpdateType", value: attachmentId });
  }, []);

  const setModel = React.useCallback((model: string) => {
    const modelId = modelNameIndex?.[model.toLowerCase()]?.id || -1;
    setError((error) => {
      if (error?.model) {
        return { ...error, model: undefined };
      }
      return error;
    });
    dispatch({ type: "UpdateModel", value: modelId });
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
        <div>
          <ModelSelect
            model={formData.model}
            models={models}
            setModel={setModel}
          />

          {error?.model && (
            <p className="text-sm text-red-500">{error.model}</p>
          )}
        </div>

        <div>
          <NameSelect
            attachment_names={attachment_names}
            setName={setName}
            name={formData.type}
          />

          {error?.type && <p className="text-sm text-red-500">{error.type}</p>}
        </div>

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
                  onChange={(e) =>
                    dispatch({
                      type: "UpdatePros",
                      value: e.target.value,
                      index: i,
                    })
                  }
                />
                <Button
                  className="px-2"
                  variant="outline"
                  type="button"
                  onClick={() => dispatch({ type: "RemovePro", index: i })}
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
                dispatch({ type: "AddPro" });
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
                  onChange={(e) =>
                    dispatch({
                      type: "UpdateCons",
                      value: e.target.value,
                      index: i,
                    })
                  }
                />
                <Button
                  className="px-2"
                  variant="outline"
                  type="button"
                  onClick={() => dispatch({ type: "RemoveCon", index: i })}
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
                dispatch({ type: "AddCon" });
              });
              currentConInput.current?.focus();
            }}
          >
            New
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "mt-6 flex items-center justify-end w-full",
          attachmentId && "justify-between"
        )}
      >
        {attachmentId && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleDelete(attachmentId)}
          >
            Delete
          </Button>
        )}
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

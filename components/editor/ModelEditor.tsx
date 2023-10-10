"use client";
import React from "react";
import type { Model } from "@/types/types";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { deleteItem, getItem, updateItem, insertItem } from "@/utils/functions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { gunTypes } from "@/utils/gun_details";
import { PostgrestError } from "@supabase/supabase-js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type Action =
  | {
      type: "UpdateName" | "UpdateType";
      value: string;
    }
  | {
      type: "Reset";
      value: Model;
    };

const reducer = (state: Model, action: Action) => {
  switch (action.type) {
    case "UpdateName": {
      return { ...state, name: action.value };
    }
    case "UpdateType": {
      return { ...state, type: action.value };
    }
    case "Reset": {
      return action.value;
    }
  }
};

const errorMessages: {
  [key: string]: { message: string; field: string } | undefined;
} = {
  "23505": {
    message: "A model with that name already exists",
    field: "name",
  },
};

type Error = {
  name?: string;
  server?: string;
};

export default function ModelEditor({ modelId }: { modelId?: string }) {
  const supabase = createClientComponentClient<Database>();

  const { data: model } = useQuery({
    queryKey: ["models", modelId],
    queryFn: () => getItem<Model>(supabase, "models", modelId!),
    enabled: !!modelId,
  });

  const [formData, dispatch] = React.useReducer(
    reducer,
    model || {
      name: "",
      type: "assault",
    }
  );

  const [error, setError] = React.useState<Error | null>(null);

  const id = React.useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!model) return;
    dispatch({ type: "Reset", value: model });
  }, [model]);

  const newMutation = useMutation<
    {
      data: null;
      error: PostgrestError | null;
    },
    PostgrestError,
    Model
  >({
    mutationFn: (newData: Model) => {
      return insertItem(supabase, "models", newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      router.back();
    },
    onError: (error) => {
      const errorDetails = errorMessages[error.code];
      if (!errorDetails) {
        setError({ server: error.message });
        return;
      }
      setError({ [errorDetails.field]: errorDetails.message });
    },
  });

  const updateMutation = useMutation<
    {
      data: null;
      error: PostgrestError | null;
    },
    PostgrestError,
    {
      updatedData: Model;
      id: string;
    }
  >({
    mutationFn: ({ updatedData, id }: { updatedData: Model; id: string }) => {
      return updateItem<Model>(supabase, "models", id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      router.back();
    },
    onError: (error) => {
      const errorDetails = errorMessages[error.code];
      if (!errorDetails) {
        setError({ server: error.message });
        return;
      }
      setError({ [errorDetails.field]: errorDetails.message });
    },
  });

  const deleteMutation = useMutation<
    {
      data: null;
      error: PostgrestError | null;
    },
    PostgrestError,
    string
  >({
    mutationFn: (id: string) => {
      return deleteItem(supabase, "models", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"], exact: true });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    if (!modelId) {
      newMutation.mutate(formData);
      return;
    }

    updateMutation.mutate({ updatedData: formData, id: modelId });
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <form action={handleSubmit} className="">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Model Editor
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Edit an existing gun model from the database.
      </p>
      <div className="mt-10 flex flex-col gap-y-6">
        <div className="">
          <label
            htmlFor={`${id}-type`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Type
          </label>
          <div className="mt-2">
            <Select
              onValueChange={(value) => dispatch({ type: "UpdateType", value })}
              defaultValue={formData.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an weapon category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(gunTypes).map((key) => (
                  <SelectItem value={key} key={key}>
                    {gunTypes[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="">
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor={`${id}-name`}
          >
            Name
          </label>
          <div className="mt-2">
            <Input
              type="text"
              id={`${id}-name`}
              value={formData.name}
              onChange={(e) =>
                dispatch({ type: "UpdateName", value: e.target.value })
              }
            />
          </div>
          {error?.name && <p className="text-sm text-red-500">{error.name}</p>}
        </div>
      </div>
      <div
        className={cn(
          "mt-6 flex items-center justify-end w-full",
          modelId && "justify-between"
        )}
      >
        {modelId && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleDelete(modelId)}
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

"use client";
import React from "react";
import type { Model } from "@/types/types";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { classNames, deleteItem, getItem, updateItem } from "@/utils/functions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export default function EditModel({ modelId }: { modelId: string }) {
  const supabase = createClientComponentClient<Database>();

  const { data: model } = useQuery({
    queryKey: ["models", modelId],
    queryFn: () => getItem<Model>(supabase, "models", modelId),
  });

  const [formData, setFormData] = React.useState<Model | undefined>(model);
  const id = React.useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setFormData(model);
  }, [model]);

  const updateMutation = useMutation({
    mutationFn: (updatedData: Model) => {
      return updateItem<Model>(supabase, "models", modelId, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return deleteItem(supabase, "models", modelId);
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
    if (!formData) return;
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
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
            <select
              name="type"
              id={`${id}-type`}
              value={formData ? formData.type : "assault"}
              onChange={(e) => {
                if (!formData) return;
                setFormData({ ...formData, type: e.target.value });
              }}
              className={classNames(
                "transition-colors block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6",
                formData ? "text-gray-900" : "text-white"
              )}
            >
              <option value="assault">Assault</option>
              <option value="smg">SMG</option>
            </select>
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
            <input
              className={classNames(
                "transition-colors block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6",
                formData ? "text-gray-900" : "text-white"
              )}
              type="text"
              id={`${id}-name`}
              value={formData ? formData.name : ""}
              onChange={(e) => {
                if (!formData) return;
                setFormData({ ...formData, name: e.target.value });
              }}
            />
          </div>
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

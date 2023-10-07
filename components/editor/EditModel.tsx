"use client";
import React from "react";
import type { Model } from "@/types/types";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { classNames, deleteItem, getItem, updateItem } from "@/utils/functions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { gunTypes } from "@/utils/gun_details";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
            <Select
              onValueChange={(value) => {
                if (!formData) return;
                setFormData({ ...formData, type: value });
              }}
              defaultValue={formData ? formData.type : "assault"}
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
              value={formData ? formData.name : ""}
              onChange={(e) => {
                if (!formData) return;
                setFormData({ ...formData, name: e.target.value });
              }}
            />
          </div>
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

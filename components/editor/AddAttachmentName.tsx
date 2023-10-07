"use client";
import React from "react";
import type { AttachmentName } from "@/types/types";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertItem } from "@/utils/functions";
import { attachmentTypes } from "@/utils/gun_details";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function AddAttachmentName() {
  const supabase = createClientComponentClient<Database>();
  const [formData, setFormData] = React.useState<AttachmentName>({
    type: "muzzle",
    name: "",
  });
  const id = React.useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const newMutation = useMutation({
    mutationFn: (newData: AttachmentName) => {
      return insertItem(supabase, "attachment_names", newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    newMutation.mutate(formData);
  };

  return (
    <form action={handleSubmit} className="">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Attachment Type Editor
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Add a new attachment type to the database.
      </p>
      <div className="mt-10 flex flex-col gap-y-6">
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
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="">
          <label
            htmlFor={`${id}-type`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Type
          </label>
          <div className="mt-2">
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
              defaultValue={formData.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an attachment type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(attachmentTypes).map((key) => (
                  <SelectItem value={key} key={key}>
                    {attachmentTypes[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

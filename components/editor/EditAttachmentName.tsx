"use client";
import React from "react";
import type { AttachmentName } from "@/types/types";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { classNames, deleteItem, getItem, updateItem } from "@/utils/functions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export default function EditAttachmentName({
  attachmentId,
}: {
  attachmentId: string;
}) {
  const supabase = createClientComponentClient<Database>();

  const { data: type } = useQuery({
    queryKey: ["types", attachmentId],
    queryFn: () =>
      getItem<AttachmentName>(supabase, "attachment_names", attachmentId),
  });

  const [formData, setFormData] = React.useState<AttachmentName | undefined>(
    type
  );
  const id = React.useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setFormData(type);
  }, [type]);

  const updateMutation = useMutation({
    mutationFn: (updatedData: AttachmentName) => {
      return updateItem<AttachmentName>(
        supabase,
        "attachment_names",
        attachmentId,
        updatedData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      // await supabase.from("attachment_names").delete().eq("id", attachmentId);
      return deleteItem(supabase, "attachment_names", attachmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"], exact: true });
      router.back();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = () => {
    if (!formData) return;
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <form action={handleSubmit} className="">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Attachment Type Editor
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Edit an existing attachment type in the database.
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
            <input
              className={classNames(
                "transition-colors block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6",
                formData ? "text-gray-900" : "text-white"
              )}
              type="text"
              id={`${id}-name`}
              value={formData ? formData?.name : ""}
              onChange={(e) => {
                if (!formData) return;
                setFormData({ ...formData, name: e.target.value });
              }}
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
            <select
              name="type"
              id={`${id}-type`}
              value={formData ? formData?.type : "muzzle"}
              onChange={(e) => {
                if (!formData) return;
                setFormData({ ...formData, type: e.target.value });
              }}
              className={classNames(
                "transition-colors block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6",
                formData ? "text-gray-900" : "text-white"
              )}
            >
              <option value="muzzle">Muzzle</option>
              <option value="barrel">Barrel</option>
              <option value="optic">Optic</option>
              <option value="stock">Stock</option>
              <option value="grip">Rear Grip</option>
              <option value="magazine">Magazine</option>
              <option value="underbarrel">Underbarrel</option>
              <option value="laser">Laser</option>
              <option value="perk">Perk</option>
            </select>
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

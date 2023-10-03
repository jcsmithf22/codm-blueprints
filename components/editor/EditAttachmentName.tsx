"use client";
import React from "react";
import { updateAttachmentName } from "@/app/actions";
import type { AttachmentName } from "@/types/types";
import { useRouter } from "next/navigation";

export default function EditAttachmentName({
  attachment_name,
  attachmentId,
}: {
  attachment_name: AttachmentName;
  attachmentId: string;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] =
    React.useState<AttachmentName>(attachment_name);
  const id = React.useId();
  const router = useRouter();

  const handleSubmit = async () => {
    const error = await updateAttachmentName(formData, attachmentId);
    if (!error) {
      router.back();
    }
    console.log(error);
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
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
            <select
              name="type"
              id={`${id}-type`}
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
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

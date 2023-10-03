import React from "react";
import type { AttachmentName, Attachment, Model } from "@/types/types";
export const NameSelect = React.memo(
  ({
    attachment_names,
    setFormData,
    name,
  }: {
    attachment_names: AttachmentName[];
    setFormData: React.Dispatch<React.SetStateAction<Attachment>>;
    name: number;
  }) => {
    const id = React.useId();
    return (
      <div className="">
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor={`${id}-name`}
        >
          Name
        </label>
        <div className="mt-2">
          <select
            name="name"
            id={`${id}-name`}
            value={name}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                type: parseInt(e.target.value),
              }))
            }
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value={""}>Select Name</option>
            {attachment_names.map((attachment) => (
              <option key={attachment.id} value={attachment.id}>
                {attachment.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
);

export const ModelSelect = React.memo(
  ({
    model,
    models,
    setFormData,
  }: {
    model: number;
    models: Model[];
    setFormData: React.Dispatch<React.SetStateAction<Attachment>>;
  }) => {
    const id = React.useId();
    return (
      <div className="">
        <label
          htmlFor={`${id}-model`}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Model
        </label>
        <div className="mt-2">
          <select
            name="model"
            id={`${id}-model`}
            value={model}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                model: parseInt(e.target.value),
              }))
            }
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value={-1}>Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
);

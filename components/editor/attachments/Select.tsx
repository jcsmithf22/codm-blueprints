import React from "react";
import type { AttachmentName, Attachment, Model } from "@/types/types";
import { classNames } from "@/utils/functions";

export const NameSelect = React.memo(
  ({
    attachment_names,
    setName,
    name,
  }: {
    attachment_names: AttachmentName[] | null | undefined;
    setName: (name: string) => void;
    name: number | null;
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
            value={name ? name : -1}
            onChange={(e) => setName(e.target.value)}
            className={classNames(
              "transition-colors block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6",
              name ? "text-gray-900" : "text-white"
            )}
          >
            <option value={-1}>Select Name</option>
            {attachment_names?.map((attachment) => (
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
    setModel,
  }: {
    model: number | null;
    models: Model[] | null | undefined;
    setModel: (model: string) => void;
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
            value={model ? model : -1}
            onChange={(e) => setModel(e.target.value)}
            className={classNames(
              "transition-colors block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6",
              model ? "text-gray-900" : "text-white"
            )}
          >
            <option value={-1}>Select Model</option>
            {models?.map((model) => (
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

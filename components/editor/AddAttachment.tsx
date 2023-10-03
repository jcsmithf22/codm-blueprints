"use client";
import React from "react";
import { produce } from "immer";
import { addAttachment } from "@/app/actions";
import type { Attachment, AttachmentName, Model } from "@/types/types";
import { useRouter } from "next/navigation";
import { NameSelect, ModelSelect } from "./attachments/Select";

export default function AddAttachment({
  attachment_names,
  models,
}: {
  attachment_names: AttachmentName[];
  models: Model[];
}) {
  const [error, setError] = React.useState<string | null>(null);
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

  const handleSubmit = async () => {
    const filteredState = produce(formData, (draft) => {
      draft.characteristics.pros = draft.characteristics.pros.filter(
        (pro) => pro !== ""
      );
      draft.characteristics.cons = draft.characteristics.cons.filter(
        (con) => con !== ""
      );
    });

    const error = await addAttachment(filteredState);
    if (!error) {
      router.back();
    }
    console.log(error);
  };
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
          setFormData={setFormData}
        />

        <NameSelect
          name={formData.type}
          attachment_names={attachment_names}
          setFormData={setFormData}
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
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                <button
                  className="rounded-md bg-white px-1.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              setFormData(
                produce(formData, (draft) => {
                  draft.characteristics.pros.push("");
                })
              );
            }}
          >
            New
          </button>
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
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                <button
                  className="rounded-md bg-white px-1.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              setFormData(
                produce(formData, (draft) => {
                  draft.characteristics.cons.push("");
                })
              );
            }}
          >
            New
          </button>
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

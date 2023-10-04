// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getItems } from "@/utils/functions";
import Link from "next/link";
import { Attachment, Model, AttachmentName } from "@/types/types";
import { Database } from "@/types/supabase";
import { Suspense } from "react";
import LoadingTable from "@/components/LoadingTable";

export default function ServerComponent() {
  return (
    <Suspense
      fallback={
        <LoadingTable title="Models">
          A list of all models in the database.
        </LoadingTable>
      }
    >
      <Table />
    </Suspense>
  );
}

async function Table() {
  // Create a Supabase client configured to use cookies
  const supabase = createServerComponentClient<Database>({ cookies });

  // This assumes you have a `todos` table in Supabase. Check out
  // the `Create Table and seed with data` section of the README 👇
  // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
  const modelsData = getItems<Model>(supabase, "models");
  const attachmentsData = getItems<Attachment>(supabase, "attachments");
  const attachmentNamesData = getItems<AttachmentName>(
    supabase,
    "attachment_names"
  );

  const [models, attachments, attachment_names] = await Promise.all([
    modelsData,
    attachmentsData,
    attachmentNamesData,
  ]);

  return (
    <div className="bg-gray-100 pt-8 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Models
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all models in the database.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/dashboard/models/create"
              className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Add model
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Attachments
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {models?.map((model) => (
                      <tr key={model.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {model.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {model.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {model.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="max-h-24 overflow-y-scroll">
                            {attachments
                              ?.filter(
                                (attachment) => attachment.model === model.id
                              )
                              .map((attachment) => (
                                <p className="" key={attachment.id}>
                                  {
                                    attachment_names?.find(
                                      (name) => name.id === attachment.type
                                    )?.name
                                  }
                                </p>
                              ))}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/dashboard/models/edit/${model.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                            <span className="sr-only">, {model.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

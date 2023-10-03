// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";
import Link from "next/link";
import { getItems } from "@/utils/functions";
import { Attachment, AttachmentName, Model } from "@/types/types";

export default async function ServerComponent() {
  // Create a Supabase client configured to use cookies
  const supabase = createServerComponentClient<Database>({ cookies });

  // This assumes you have a `todos` table in Supabase. Check out
  // the `Create Table and seed with data` section of the README 👇
  // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
  // const { data: attachments } = await supabase.from("attachments").select();
  const attachmentsData = getItems<Attachment>(supabase, "attachments");
  const modelsData = getItems<Model>(supabase, "models");
  const attachmentNamesData = getItems<AttachmentName>(
    supabase,
    "attachment_names"
  );
  const [attachments, models, attachment_names] = await Promise.all([
    attachmentsData,
    modelsData,
    attachmentNamesData,
  ]);

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  //  attachments of the type Attachment[]

  // return <div className="">test</div>;

  return (
    <div className="bg-gray-100 pt-8 min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Attachments
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all attachments in the database.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/dashboard/attachments/create"
              className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Add attachment
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
                        Model
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Characteristics
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
                    {attachments?.map((attachment) => (
                      <tr key={attachment.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {attachment.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {
                            attachment_names?.find(
                              (name) => name.id === attachment.type
                            )?.name
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {
                            attachment_names?.find(
                              (name) => name.id === attachment.type
                            )?.type
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {
                            models?.find(
                              (model) => model.id === attachment.model
                            )?.name
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {attachment.characteristics.pros.map((pro) => (
                            <p
                              className="text-green-600 flex gap-x-1 items-center"
                              key={pro}
                            >
                              <svg
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                                />
                              </svg>
                              {pro}
                            </p>
                          ))}
                          {attachment.characteristics.cons.map((con) => (
                            <p
                              className="text-red-600 flex gap-x-1 items-center"
                              key={con}
                            >
                              <svg
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                              {con}
                            </p>
                          ))}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/dashboard/attachments/edit/${attachment.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                            <span className="sr-only">
                              ,
                              {
                                attachment_names?.find(
                                  (name) => name.id === attachment.type
                                )?.name
                              }
                            </span>
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

  // return <pre>{JSON.stringify(attachments, null, 2)}</pre>;
}

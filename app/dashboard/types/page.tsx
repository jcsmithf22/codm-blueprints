// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { Database } from "@/types/supabase";
import Link from "next/link";
// import { getItems } from "@/utils/functions";
// import { AttachmentName } from "@/types/types";
import TypeRows from "@/components/table/TypeRows";
// import { unstable_cache } from "next/cache";

// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";

export default function TypesPage() {
  // return <pre>{JSON.stringify(attachments, null, 2)}</pre>;
  // const cookieData = cookies();
  // const supabase = createServerComponentClient<Database>({
  //   cookies: () => cookieData,
  // });
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["types"],
  //   queryFn: () => getItems<AttachmentName>(supabase, "attachment_names"),
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <div className="bg-gray-100 pt-8 h-screen overflow-y-scroll">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Types
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all attachment types in the database.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/dashboard/types/create"
              className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Add type
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
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {/* <TypeRows initialTypes={initialTypes} /> */}
                    <TypeRows />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </HydrationBoundary>
  );
}

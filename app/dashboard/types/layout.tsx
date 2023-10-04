// export const dynamic = "force-dynamic";
import { Suspense } from "react";
import LoadingTable from "@/components/LoadingTable";

export default async function ServerLayout(props: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <Suspense
          fallback={
            <LoadingTable title="Types">
              A list of all attachment types in the datacase.
            </LoadingTable>
          }
        >
          {props.children}
        </Suspense>
      </div>
      {props.sidebar}
    </div>
  );
}

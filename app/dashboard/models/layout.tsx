import { Suspense } from "react";
import LoadingTable from "@/components/LoadingTable";
export default async function ServerLayout(props: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <>
      <Suspense
        fallback={
          <LoadingTable title="Models">
            A list of all models in the database.
          </LoadingTable>
        }
      >
        {props.children}
      </Suspense>
      {props.sidebar}
    </>
  );
}

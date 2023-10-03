import LoadingTable from "@/components/LoadingTable";
import { Suspense } from "react";

export default async function ServerLayout(props: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <>
      <Suspense
        fallback={
          <LoadingTable title="Attachments">
            A list of all attachments in the database.
          </LoadingTable>
        }
      >
        {props.children}
      </Suspense>
      {props.sidebar}
    </>
  );
}

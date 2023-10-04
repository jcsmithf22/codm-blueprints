import { Suspense } from "react";
import LoadingTable from "@/components/LoadingTable";
export default async function ServerLayout(props: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <>
      {props.children}
      {props.sidebar}
    </>
  );
}

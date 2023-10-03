import { Suspense } from "react";

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

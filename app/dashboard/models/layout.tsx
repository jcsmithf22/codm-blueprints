export const dynamic = "force-dynamic";
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

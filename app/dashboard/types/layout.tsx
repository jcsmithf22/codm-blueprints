export const dynamic = "force-dynamic";

export default async function ServerLayout(props: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <div className="flex-1">{props.children}</div>
      {props.sidebar}
    </div>
  );
}

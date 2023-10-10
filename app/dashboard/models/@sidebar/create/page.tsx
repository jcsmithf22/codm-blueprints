import ModelEditor from "@/components/editor/ModelEditor";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default async function Create() {
  return (
    <Sidebar>
      <ModelEditor />
    </Sidebar>
  );
}

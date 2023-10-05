import AddModel from "@/components/editor/AddModel";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default async function Create() {
  return (
    <Sidebar>
      <AddModel />
    </Sidebar>
  );
}

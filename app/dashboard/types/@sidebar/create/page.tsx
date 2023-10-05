import AddAttachmentName from "@/components/editor/AddAttachmentName";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default async function Create() {
  return (
    <Sidebar>
      <AddAttachmentName />
    </Sidebar>
  );
}

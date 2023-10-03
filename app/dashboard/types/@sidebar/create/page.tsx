import AddAttachmentName from "@/components/editor/AddAttachmentName";
import Sidebar from "@/components/Sidebar";

export default async function Create() {
  return (
    <Sidebar>
      <AddAttachmentName />
    </Sidebar>
  );
}

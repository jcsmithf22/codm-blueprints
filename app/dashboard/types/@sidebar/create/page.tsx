import AddAttachmentName from "@/components/editor/AddAttachmentName";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-static";

export default function Create() {
  return (
    <Sidebar>
      <AddAttachmentName />
    </Sidebar>
  );
}

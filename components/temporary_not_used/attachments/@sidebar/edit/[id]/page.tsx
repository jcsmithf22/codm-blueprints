import EditAttachment from "@/components/editor/EditAttachment";
import Sidebar from "@/components/Sidebar";

export default function Edit({ params }: { params: { id: string } }) {
  return (
    <Sidebar>
      <EditAttachment attachmentId={params.id} />
    </Sidebar>
  );
}

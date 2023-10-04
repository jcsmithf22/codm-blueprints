import EditAttachmentName from "@/components/editor/EditAttachmentName";
import Sidebar from "@/components/Sidebar";

export default function Edit({ params }: { params: { id: string } }) {
  return (
    <Sidebar>
      <EditAttachmentName attachmentId={params.id} />
    </Sidebar>
  );
}

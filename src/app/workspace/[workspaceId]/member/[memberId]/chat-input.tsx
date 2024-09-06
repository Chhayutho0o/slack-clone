import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { EidtorValue } from "@/components/editor";
import { useCreateMessage } from "@/features/messages/api/use-create-message.";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url.";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface Props {
  placeholder: string;
  conversationId: Id<"conversations">;
}

type createMessageValue = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage">;
};

export default function ChatInput({ placeholder, conversationId }: Props) {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({ body, image }: EidtorValue) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);
      const values: createMessageValue = {
        workspaceId,
        conversationId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found!");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) throw new Error("Failed to upload image!");

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message!");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
}

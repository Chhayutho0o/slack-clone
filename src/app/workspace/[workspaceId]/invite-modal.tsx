import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useNewCodeWorkspace } from "@/features/workspaces/api/use-new-code-workspace";
import { cn } from "@/lib/utils";
import { UseConfirm } from "@/hooks/use-confirm";
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export default function InviteModal({ open, setOpen, name, joinCode }: Props) {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewCodeWorkspace();
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you sure?",
    "This will deactivate current invite code and generate a new one."
  );
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard!"));
  };

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { workspaceId },
      {
        onSuccess() {
          toast.success("Invite code regenerated");
        },
        onError() {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant={"ghost"} size={"sm"}>
              Copy link
              <Copy className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              disabled={isPending}
              variant={"outline"}
            >
              New code
              <RefreshCcw
                className={cn(
                  "size-4 ml-2 rotate-180",
                  isPending && "animate-spin"
                )}
              />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

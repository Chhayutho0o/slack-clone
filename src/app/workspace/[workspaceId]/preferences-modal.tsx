import React, { useState } from "react";
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
import { Trash } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useDestroyWorkspace } from "@/features/workspaces/api/use-destroy-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UseConfirm } from "@/hooks/use-confirm";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export default function PreferencesModal({
  open,
  setOpen,
  initialValue,
}: Props) {
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(initialValue);
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
  const [ConfirmDialog, confirm] = UseConfirm(
    "Are you sure?",
    "This action cannot be undone"
  );

  const { mutate: update, isPending: isUpdating } = useUpdateWorkspace();
  const { mutate: destroy, isPending: isDestroying } = useDestroyWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    update(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess() {
          toast.success("Workspace updated");
          setOpenEdit(false);
        },
        onError() {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleDestroy = async () => {
    const ok = await confirm();

    if (!ok) return;
    destroy(
      {
        id: workspaceId,
      },
      {
        onSuccess() {
          router.replace("/");
          toast.success("Workspace destroyed");
        },
        onError() {
          toast.error("Failed to destroy workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    disabled={isUpdating}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    required
                    autoFocus
                    minLength={3}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"outline"} disabled={isUpdating}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isUpdating}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isDestroying}
              onClick={handleDestroy}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

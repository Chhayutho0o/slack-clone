import React from "react";
import { Button } from "./ui/button";
import { MessageSquare, Pencil, Smile, Trash } from "lucide-react";
import Hint from "./hint";
import EmojiPopover from "./emoji-popover";

interface Props {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (emoji: any) => void;
  hideThreadButton?: boolean;
}

export default function Toolbar({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleThread,
  handleReaction,
  hideThreadButton,
}: Props) {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
          hint="Add reaction"
        >
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant={"ghost"}
              onClick={handleThread}
              size={"iconSm"}
              disabled={isPending}
            >
              <MessageSquare className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                variant={"ghost"}
                onClick={handleEdit}
                size={"iconSm"}
                disabled={isPending}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button
                variant={"ghost"}
                onClick={handleDelete}
                size={"iconSm"}
                disabled={isPending}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
}

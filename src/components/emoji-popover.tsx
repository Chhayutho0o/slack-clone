import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
interface Props {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
}

export default function EmojiPopover({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: Props) {
  const [openPopover, setOpenPopover] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const onSelectEmoji = (emoji: any) => {
    onEmojiSelect(emoji);
    setOpenPopover(false);

    setTimeout(() => {
      setOpenTooltip(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <Tooltip
          open={openTooltip}
          onOpenChange={setOpenTooltip}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <Picker data={data} onEmojiSelect={onSelectEmoji} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

import { TIME_THRESHOLD } from "@/constant";
import { type ClassValue, clsx } from "clsx";
import {
  differenceInMinutes,
  formatDate,
  isToday,
  isYesterday,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return formatDate(date, "EEEE, MMMM d");
};

export const displayMode = (preMessage: any, message: any) => {
  if (preMessage) {
    return (
      preMessage.user._id === message.user._id &&
      differenceInMinutes(
        new Date(message._creationTime),
        new Date(preMessage._creationTime)
      ) < TIME_THRESHOLD
    );
  }

  return false;
};

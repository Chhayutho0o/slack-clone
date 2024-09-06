"use client";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export default function WorkspaceLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data } = useGetWorkspaces();
  if (!data) return router.replace("/");
  return children;
}

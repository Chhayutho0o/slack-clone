import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMemo } from "react";

export const useCurrentMember = ({
  workspaceId,
}: {
  workspaceId: Id<"workspaces">;
}) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;

  const isAdmin = data?.role === "admin";

  return { data, isLoading, isAdmin };
};

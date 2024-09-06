import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { workspaceId: Id<"workspaces"> };
type ResponseType = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useNewCodeWorkspace = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "pending" | "settled" | null
  >(null);

  const memoizedStatus = useMemo(() => {
    return {
      isPending: status === "pending",
      isError: status === "error",
      isSettled: status === "settled",
      isSuccess: status === "success",
    };
  }, [status]);

  const mutation = useMutation(api.workspaces.newJoinCode);
  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      values;
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const res = await mutation(values);
        options?.onSuccess?.(res);
        return res;
      } catch (error) {
        options?.onError?.(error as Error);
        setStatus("error");
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, error, ...memoizedStatus };
};

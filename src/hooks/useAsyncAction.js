import { useCallback, useState } from "react";

const resolveErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export const useAsyncAction = (action) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        return await action(...args);
      } catch (caughtError) {
        setError(resolveErrorMessage(caughtError));
        throw caughtError;
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  return { loading, error, run };
};

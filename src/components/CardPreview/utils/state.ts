import { useState, useCallback } from "react";

export function usePatchState<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const patch = useCallback((p: Partial<T>) => {
    setState((prev) => ({ ...prev, ...p }));
  }, []);
  return [state, patch] as const;
}

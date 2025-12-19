import { useRef, useLayoutEffect, useCallback } from "react";

type EventHandler<T extends (...args: any[]) => any> = T;

export const useEvent = <T extends (...args: any[]) => any>(
  handler: EventHandler<T>
): T => {
  const handlerRef = useRef<EventHandler<T> | null>(null);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  const memoizedHandler = useCallback(
    (...args: Parameters<T>): ReturnType<T> => {
      const fn = handlerRef.current;
      if (!fn) {
        throw new Error("Handler is not defined");
      }
      return fn(...args);
    },
    []
  );

  return memoizedHandler as T;
};

import { useState, useRef, useEffect } from "react";

// type skills{}
type skill = {
  icon: string;
  id: number;
  name: string;
};

export const useDebouncedFetch = <T>(
  query: string,
  urlBuilder: (query: string) => string,
  delay = 300
) => {
  const [data, setData] = useState<skill[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(urlBuilder(query), {
          method: "GET",
          // signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Fetch failed:", errorData);
          setData([]);
          return;
        }

        const result = (await response.json()) as skill[];
        console.log(result);
        setData(result);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  return { data, loading };
};

import { useRef } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Default query client options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef(queryClient);
  const emotionCache = useRef(createCache({ key: "chakra" }));

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <CacheProvider value={emotionCache.current}>
        <ChakraProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}
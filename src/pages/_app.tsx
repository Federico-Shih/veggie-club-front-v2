import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import { appWithTranslation } from "next-i18next";
import { theme } from "@/styles/theme";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 20 } } }));
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);

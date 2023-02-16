import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import { appWithTranslation } from "next-i18next";
import { theme } from "@/styles/theme";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import "@/config/firebase";
import Image from "next/image";
import Link from "next/link";
import { ToastProvider } from "@chakra-ui/toast";
import { ReactQueryDevtools } from "react-query/devtools";

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 20 } } }));
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <Link href={"/"}>
            <Image priority={true} style={{ margin: 10 }} src="/long-logo.png" height={50} width={100}
                   alt="veggielogo" />
          </Link>
          <Component {...pageProps} />
          <ToastProvider />
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);

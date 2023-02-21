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
import { Flex, IconButton } from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";
import "@fontsource/poppins";

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 20 } } }));
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <Flex style={{ alignItems: "center" }} w={"100vw"}>
            <div style={{ flex: 1 }}>
              <Link href={"/"}>
                <Image priority={true} style={{ margin: 10, height: "auto" }} src="/long-logo.png" height={50}
                       width={100}
                       alt="veggielogo" />
              </Link>
            </div>
            <Link href={"/auth"}>
              <IconButton
                style={{ margin: 5 }}
                aria-label={"login"}
                icon={<MdLogin />}
              />
            </Link>
          </Flex>
          <Component {...pageProps} />
          <ToastProvider />
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);

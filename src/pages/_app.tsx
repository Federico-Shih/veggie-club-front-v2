import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/provider";
import { extendTheme } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";

const colors = {
  brand: {
    900: "#FF5C00",
  },
};

const textStyles = {
  h1: {
    fontSize: ["24px", "36px"],
    fontWeight: "regular",
    lineHeight: "110%",
    letterSpacing: "-2%",
  },
};

const theme = extendTheme(
  {
    colors,
    textStyles,
  });

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default appWithTranslation(App);

import { extendTheme } from "@chakra-ui/react";

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

export const theme = extendTheme(
  {
    colors,
    textStyles,
  });

import { Center, CircularProgress } from "@chakra-ui/react";

function LoadingPage() {
  return (
    <Center h={"100vh"} w={"100vw"}>
      <CircularProgress isIndeterminate color={"orange"} size={"150px"} />
    </Center>
  );
}

export default LoadingPage;

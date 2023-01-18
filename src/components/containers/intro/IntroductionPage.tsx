import Image from "next/image";
import { Flex } from "@chakra-ui/react";

function IntroductionPage() {
  return (
    <Flex flexDirection="column" alignItems="center">
      <Image src="/logo.png" width={80} height={120} alt="veggielogo" />
    </Flex>
  );
}

export default IntroductionPage;

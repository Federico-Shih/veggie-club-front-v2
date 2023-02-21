import Image from "next/image";
import { Box, Center, Container, Flex } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import styles from "./intro.module.css";

function IntroductionPage() {
  const { t } = useTranslation();
  return (
    <Flex flexDirection="column" alignItems="center" gap={10}>
      <Box
        className={styles["image-size"]}
      >
        <Container padding={8}>
          <Box fontSize={"xl"} marginBottom={10}>
            {t("intro.1")}
          </Box>
          <Box fontWeight={"semibold"} fontSize={"4xl"} marginBottom={30}>
            {t("intro.veggieclub-title")}
          </Box>
        </Container>
      </Box>
      <Flex flexDirection={"column"} padding={30} className={styles["light-orange-bg"]} width={"80vw"}>
        {t("intro.2")}
      </Flex>
      <Container
        className={styles["second-image-size"]}
        padding={8}
      >
        <Center fontSize={"xl"}>
          {t("intro.3")}
        </Center>
      </Container>
      <Center fontSize={"xl"}>
        <Flex gap={5} alignItems={"center"}>
          Veni a
          <Image
            src={"/long-logo.png"}
            alt={"long logo"}
            width={120}
            height={50}
            style={{ marginBottom: 5 }}
          />
        </Flex>
      </Center>
    </Flex>
  );
}

export default IntroductionPage;

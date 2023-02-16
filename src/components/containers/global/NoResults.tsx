import { CSSProperties } from "react";
import { Center } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

interface IProps {
  style?: CSSProperties;
}

function NoResults({ style }: IProps) {
  const { t } = useTranslation();
  return (
    <Center style={style} fontWeight={"bold"}>
      {t("noelements")}
    </Center>
  );
}

export default NoResults;

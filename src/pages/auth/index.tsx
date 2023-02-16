import AuthForm from "@components/containers/auth/AuthForm";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Container, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface IProps {

}

export default function Auth() {
  const router = useRouter();
  const { to } = router.query;
  return (
    <Container>
      <Link href={"/"}>
        <Flex flexDirection="column" alignItems="center">
          <Image src="/logo.png" width={60} height={120} alt="veggielogo" priority={false} />
        </Flex>
      </Link>
      <AuthForm onSuccess={() => {
        if (to && !Array.isArray(to)) {
          return router.push(to);
        }
        return router.push("/admin");
      }} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<IProps> = async ({ locale }) => ({
  props: {
    ...(
      await serverSideTranslations(locale ?? "es", ["common"])
    ),
  },
});


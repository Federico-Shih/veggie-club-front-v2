import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TabsPage } from "@/components/Tabs";

// const inter = Inter({ subsets: ['latin'] })

interface IProps {

}


export default function Home() {
  return (
    <>
      <Head>
        <title>Veggie club</title>
        <meta name="description" content="Veggie club: una diferente forma de comer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box h={"1em"} />
        <TabsPage />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<IProps> = async ({ locale }) => ({
  props: {
    ...(
      await serverSideTranslations(locale ?? "es", ["common"])
    ),
  },
});


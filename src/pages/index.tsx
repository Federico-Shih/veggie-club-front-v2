import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TabsPage } from "@/components/Tabs";
import { dehydrate, QueryClient } from "react-query";
import { getCategoriesSSR } from "@/api-functions/menu/menu.query";
import dynamic from "next/dynamic";

// const inter = Inter({ subsets: ['latin'] })

interface IProps {

}

const tabInfo = [
  {
    tabKey: "tabs.menu",
    PanelComponent: dynamic(() => import("@components/containers/menu/MenuPage"), { ssr: false }),
  },
  {
    tabKey: "tabs.introduction",
    PanelComponent: dynamic(() => import("@components/containers/intro/IntroductionPage"), { ssr: false }),
  },
  {
    tabKey: "tabs.contact",
    PanelComponent: dynamic(() => import("@components/containers/contact/ContactPage"), { ssr: false }),
  },
];

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
        <TabsPage tabs={tabInfo} />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<IProps> = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["category"],
    queryFn: getCategoriesSSR,
  });
  return ({
    props: {
      ...(
        await serverSideTranslations(locale ?? "es", ["common"])
      ),
      dehydratedState: dehydrate(queryClient),
    },
  });
};


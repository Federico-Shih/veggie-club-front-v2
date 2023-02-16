import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TabsPage } from "@/components/Tabs";
import MenuPage from "@components/containers/menu/MenuPage";
import IntroductionPage from "@components/containers/intro/IntroductionPage";
import ContactPage from "@components/containers/contact/ContactPage";

// const inter = Inter({ subsets: ['latin'] })

interface IProps {

}

const tabInfo = [
  {
    tabKey: "tabs.menu",
    PanelComponent: () => <MenuPage />,
  },
  {
    tabKey: "tabs.introduction",
    PanelComponent: () => <IntroductionPage />,
  },
  {
    tabKey: "tabs.contact",
    PanelComponent: () => <ContactPage />,
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
  return ({
    props: {
      ...(
        await serverSideTranslations(locale ?? "es", ["common"])
      ),
      // dehydratedState: dehydrate(queryClient),
    },
  });
};


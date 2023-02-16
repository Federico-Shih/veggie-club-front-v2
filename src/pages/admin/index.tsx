import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TabsPage } from "@components/Tabs";
import { AuthGuard } from "@components/guards/AuthGuard";
import AdminMenuPage from "@components/containers/admin/menu/AdminMenuPage";
import CategoryEditPage from "@components/containers/categories/CategoryEditPage";

const tabInfo = [
  {
    tabKey: "tabs.categories",
    PanelComponent: () => <CategoryEditPage />,
  },
  {
    tabKey: "tabs.menu",
    PanelComponent: () => <AdminMenuPage />,
  },
  {
    tabKey: "tabs.messages",
    PanelComponent: () => <></>,
  },
];

export default function Admin() {
  return (
    <AuthGuard>
      <Head>
        <title>Admin Veggie</title>
        <meta name="description" content="Veggie club: una diferente forma de comer" />
      </Head>
      <main>
        <TabsPage defaultIndex={1} tabs={tabInfo} />
      </main>
    </AuthGuard>
  );
}

interface IProps {
}

export const getServerSideProps: GetServerSideProps<IProps> = async ({ locale }) => {
  // const queryClient = new QueryClient();
  // const categoryPromise = queryClient.prefetchQuery("category", getCategories);
  // await Promise.all([categoryPromise]);
  return ({
    props: {
      ...(
        await serverSideTranslations(locale ?? "es", ["common"])
      ),
      // dehydratedState: dehydrate(queryClient),
    },
  });
};

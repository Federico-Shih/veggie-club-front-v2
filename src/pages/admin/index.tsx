import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { dehydrate, QueryClient } from "react-query";
import { getCategoriesSSR } from "@/api-functions/menu/menu.query";
import dynamic from "next/dynamic";

const TabsPage = dynamic(() => import("@components/Tabs").then(mod => mod.TabsPage), { ssr: false });
const AuthGuard = dynamic(() => import("@components/guards/AuthGuard").then(mod => mod.AuthGuard), { ssr: false });
const tabInfo = [
  {
    tabKey: "tabs.categories",
    PanelComponent: dynamic(() => import("@components/containers/categories/CategoryEditPage"), { ssr: false }),
  },
  {
    tabKey: "tabs.menu",
    PanelComponent: dynamic(() => import("@components/containers/admin/menu/AdminMenuPage"), { ssr: false }),
  },
  {
    tabKey: "tabs.messages",
    PanelComponent: dynamic(() => import("@components/containers/messages/MessagesAdminPage"), { ssr: false }),
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
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["category"],
      queryFn: getCategoriesSSR,
    }),
    // queryClient.prefetchQuery({
    //   queryKey: ["admin", "food", ""],
    //   queryFn: () => getAllFoodsSSR("", undefined, 16)
    // })
  ]);
  return ({
    props: {
      ...(
        await serverSideTranslations(locale ?? "es", ["common"])
      ),
      dehydratedState: dehydrate(queryClient),
    },
  });
};


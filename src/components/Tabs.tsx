import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import IntroductionPage from "@components/containers/intro/IntroductionPage";
import MenuPage from "@components/containers/menu/MenuPage";
import ContactPage from "@components/containers/contact/ContactPage";

const tabInfo = [
  {
    tabKey: "tabs.menu",
    PanelComponent: MenuPage,
  },
  {
    tabKey: "tabs.introduction",
    PanelComponent: IntroductionPage,
  },
  {
    tabKey: "tabs.contact",
    PanelComponent: ContactPage,
  },
];

const TabsPage = () => {
  const { t } = useTranslation();
  return (
    <Tabs isLazy isFitted w="100vw">
      <TabList>
        {
          tabInfo.map(({ tabKey }) => (
              <Tab
                key={tabKey}
                _selected={{ borderBottomColor: "brand.900", color: "brand.900" }}
                style={{ textTransform: "uppercase", fontWeight: "600" }}
              >
                {t(tabKey)}
              </Tab>
            ),
          )
        }
      </TabList>
      <TabPanels>
        {
          tabInfo.map(({ PanelComponent }, index) => (
            <TabPanel key={index} pl={0} pr={0}>
              <PanelComponent />
            </TabPanel>
          ))
        }
      </TabPanels>
    </Tabs>
  );
};

export { TabsPage };

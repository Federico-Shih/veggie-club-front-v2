import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";


type TabData = {
  tabKey: string;
  PanelComponent: () => JSX.Element;
}

interface IProps {
  tabs: TabData[];
  defaultIndex?: number;
}

const TabsPage = ({ tabs, defaultIndex }: IProps) => {
  const { t } = useTranslation();
  return (
    <Tabs isLazy isFitted w="100vw" defaultIndex={defaultIndex || 0}>
      <TabList>
        {
          tabs.map(({ tabKey }) => (
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
          tabs.map(({ PanelComponent }, index) => (
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

import TagList from "@components/containers/menu/TagList";
import { useMemo, useState } from "react";
import { Grid, GridItem, useDisclosure, VStack } from "@chakra-ui/react";
import { Food } from "@/domain/foods";
import FoodCard from "@components/containers/menu/food/FoodCard";
import FoodModal from "@components/containers/menu/food/FoodModal";
import { useCategories, useFoods } from "./menu.hooks";
import { dehydrate, QueryClient } from "react-query";
import { getCategories } from "@/api-functions/menu/menu.query";
import { DaySelector } from "@components/containers/menu/day-selector/DaySelector";

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("category", getCategories);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

function MenuPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shownFood, setShownFood] = useState<Food | null>(null);
  const [selectedId, setSelected] = useState("");
  const [shownDay, setShownDay] = useState(new Date().getDay());
  const { data: categories, isSuccess: isCategorySuccess } = useCategories();
  const { data: foods, isSuccess: isFoodSuccess } = useFoods(shownDay);
  const filteredFoods = useMemo(() => {
    return (foods || []).filter((food) => (selectedId.length === 0 || food.categories.includes(selectedId)));
  }, [foods, selectedId]);
  return (
    <>
      <VStack gap={5} style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ width: "100%" }}>
          {
            isCategorySuccess && (
              <TagList
                categories={categories}
                selectedId={selectedId}
                onSelectTag={setSelected}
              />
            )
          }
        </div>
        <Grid style={{ width: "100%" }} templateColumns={"repeat(2, 1fr)"} gap={4}>
          {
            isFoodSuccess && (
              filteredFoods.map((food) => {
                return (
                  <GridItem key={food.id} w={"100%"}>
                    <FoodCard
                      food={food}
                      onClick={
                        (food) => {
                          setShownFood(food);
                          onOpen();
                        }} />
                  </GridItem>
                );
              })
            )
          }
        </Grid>
      </VStack>
      <FoodModal food={shownFood} categories={categories || []} isOpen={isOpen} onClose={onClose} />
      <DaySelector setDay={setShownDay} initialDay={shownDay} />
    </>
  );
}

export default MenuPage;

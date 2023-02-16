import TagList from "@components/containers/categories/TagList";
import { useState } from "react";
import { CircularProgress, Grid, GridItem, Skeleton, Stack, useDisclosure, VStack } from "@chakra-ui/react";
import { Food } from "@/domain/foods";
import FoodCard from "@components/containers/food/FoodCard";
import FoodModal from "@components/containers/food/FoodModal";
import { useCategories, useFoods } from "./menu.hooks";
import { DaySelector } from "@components/containers/menu/day-selector/DaySelector";
import InfiniteScroll from "react-infinite-scroll-component";

function MenuPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shownFood, setShownFood] = useState<Food | null>(null);

  const { data: categories, isSuccess: isCategorySuccess } = useCategories();
  const { values, actions } = useFoods(16);

  return (
    <>
      <VStack gap={5} style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ width: "100%" }}>
          {
            isCategorySuccess && (
              <TagList
                categories={categories}
                selectedId={values.category}
                onSelectTag={actions.switchCategories}
              />
            )
          }
        </div>
        <InfiniteScroll
          next={actions.fetchNextPage}
          hasMore={!!values.pagination?.nextCursor}
          dataLength={values.data.length}
          loader={<CircularProgress />}
        >
          <Grid style={{ width: "100%" }} templateColumns={"repeat(2, 1fr)"} gap={4}>
            {
              values.data.map((food) => {
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
            }
          </Grid>
        </InfiniteScroll>
        {
          (values.data.length === 0 && values.loading) && (
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          )
        }
      </VStack>
      <FoodModal food={shownFood} categories={categories || []} isOpen={isOpen} onClose={onClose} />
      <DaySelector setDay={actions.setDay} initialDay={values.shownDay} />
    </>
  );
}

export default MenuPage;

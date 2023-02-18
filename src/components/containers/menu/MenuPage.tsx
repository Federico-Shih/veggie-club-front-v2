import TagList from "@components/containers/categories/TagList";
import { useCallback, useMemo, useState } from "react";
import { CircularProgress, Grid, GridItem, Skeleton, Stack, useDisclosure, VStack } from "@chakra-ui/react";
import { Food } from "@/domain/foods";
import FoodCard from "@components/containers/food/FoodCard";
import FoodModal from "@components/containers/food/FoodModal";
import { useCategories, useFoods, useMessages } from "./menu.hooks";
import { DaySelector } from "@components/containers/menu/day-selector/DaySelector";
import InfiniteScroll from "react-infinite-scroll-component";
import NoResults from "@components/containers/global/NoResults";
import { useRouter } from "next/router";

type QueryParams = {
  category?: string;
  weekday?: number;
}

function MenuPage() {
  const router = useRouter();
  const { weekday, category } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shownFood, setShownFood] = useState<Food | null>(null);
  const messages = useMessages();

  const initialDay = useMemo(() => {
    if (typeof weekday === "string") {
      const initialDay = parseInt(weekday, 10);
      if (!isNaN(initialDay)) {
        return initialDay;
      }
    }
    return new Date().getDay();
  }, [weekday]);

  const filteredCategory = useMemo(() => {
    if (typeof category === "string") {
      return category;
    }
    return "";
  }, [category]);
  const { values, actions } = useFoods({ initialDay, category: filteredCategory, limit: 16 });

  const getNextQueryParams = useCallback((newParams: QueryParams) => {
    const prevParams = { weekday, category, ...newParams };
    const parsedParams = {
      category: typeof prevParams.category === "string" ? prevParams.category : "",
      weekday: typeof prevParams.weekday === "string" ? prevParams.weekday : (
        typeof prevParams.weekday === "number" ? prevParams.weekday.toString() : ""
      ),
    };
    return `?${new URLSearchParams(parsedParams).toString()}`;
  }, [category, weekday]);


  const { data: categories, isSuccess: isCategorySuccess } = useCategories();
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
          style={{ width: "100vw", padding: "0 16px 0 16px" }}
          next={actions.fetchNextPage}
          hasMore={(!!values.pagination?.nextCursor) && values.category.length === 0}
          dataLength={values.data.length}
          loader={<CircularProgress isIndeterminate />}
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
        {
          (!values.loading && values.data.length === 0) && (
            <NoResults />
          )
        }
      </VStack>
      <FoodModal
        food={shownFood}
        categories={categories || []}
        isOpen={isOpen}
        onClose={onClose}
        onCategoryTagClick={(id) => {
          router.push(getNextQueryParams({ category: id }), undefined);
        }}
        onDayTagClick={(day) => {
          router.push(getNextQueryParams({ weekday: day }), undefined);
        }}
      />
      <DaySelector setDay={actions.setDay} initialDay={values.shownDay} />
    </>
  );
}

export default MenuPage;

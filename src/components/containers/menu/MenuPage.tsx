import TagList from "@components/containers/menu/TagList";
import { useState } from "react";
import { Grid, GridItem, useDisclosure, VStack } from "@chakra-ui/react";
import { Food } from "@/domain/foods";
import FoodCard from "@components/containers/menu/food/FoodCard";
import FoodModal from "@components/containers/menu/food/FoodModal";

function MenuPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shownFood, setShownFood] = useState<Food | null>(null);
  const [selectedId, setSelected] = useState(-1);
  const foods: Food[] = [{ name: "hola", description: "chau", imageSource: "/logo.png", categories: [], id: 1 }];
  return (
    <>
      <VStack gap={5} style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ width: "100%" }}>
          <TagList
            categories={[{ name: "hola", id: 2 }, { name: "hola", id: 3 }, { name: "hola", id: 4 }]}
            selectedId={selectedId}
            onSelectTag={setSelected}
          />
        </div>
        <Grid style={{ width: "100%" }} templateColumns={"repeat(2, 1fr)"} gap={4}>
          {
            foods.map((food) => {
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
      </VStack>
      <FoodModal food={shownFood} categories={[]} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default MenuPage;

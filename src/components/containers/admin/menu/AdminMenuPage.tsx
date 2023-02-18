import { useCategories } from "@components/containers/menu/menu.hooks";
import { Button, Center, CircularProgress, Grid, GridItem, useDisclosure, VStack } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";

import TagList from "@components/containers/categories/TagList";
import { useState } from "react";
import { useAdminFoods, useDeleteFood, useSaveFood } from "@components/containers/admin/menu/admin.hooks";
import FoodCard from "@components/containers/food/FoodCard";
import FoodAdminModal from "@components/containers/food/FoodAdminModal";
import { Food } from "@/domain/foods";
import InfiniteScroll from "react-infinite-scroll-component";
import FoodDeleteModal from "@components/containers/food/FoodDeleteModal";
import NoResults from "@components/containers/global/NoResults";

function AdminMenuPage() {
  const { isOpen: isAdminOpen, onOpen: onOpenAdmin, onClose: onCloseAdmin } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const [selectedId, setSelected] = useState("");
  const [editedFood, setEditedFood] = useState<Food | null>(null);

  const { data: categories, isSuccess: isCategorySuccess } = useCategories();
  const {
    data: foods,
    isSuccess: isFoodSuccess,
    fetchNextPage,
    hasNextPage,
    isLoading: foodIsLoading,
  } = useAdminFoods(selectedId, 16);
  const { mutate: mutateFood, isLoading: isSaving } = useSaveFood({ setEditedFood });
  const { mutate: onDeleteFood, isLoading } = useDeleteFood(onCloseAdmin);

  return (
    <>
      <VStack gap={5} style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ width: "100%" }}>
          {
            isCategorySuccess && (
              <TagList
                categories={categories}
                selectedId={selectedId}
                onSelectTag={(tagSelected) => {
                  if (tagSelected === selectedId) {
                    return setSelected("");
                  }
                  setSelected(tagSelected);
                }}
              />
            )
          }
        </div>
        <InfiniteScroll
          style={{ overflow: "hidden", width: "100vw", paddingLeft: 16, paddingRight: 16 }}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <Center>
              <CircularProgress isIndeterminate />
            </Center>
          }
          dataLength={foods?.pages.length || 0}
        >
          <Grid style={{ width: "100%" }} templateColumns={"repeat(2, 1fr)"} gap={4}>
            {
              isFoodSuccess && (
                foods?.pages.map((page) => (
                  page.data.map((food) => {
                    return (
                      <GridItem key={food.id} w={"100%"}>
                        <FoodCard
                          food={food}
                          onClick={
                            (food) => {
                              setEditedFood(food);
                              onOpenAdmin();
                            }} />
                      </GridItem>
                    );
                  })
                ))
              )
            }
          </Grid>
        </InfiniteScroll>
        {
          (!foodIsLoading && foods?.pages[0].data.length === 0) && (
            <NoResults />
          )
        }
        <FoodAdminModal
          food={editedFood}
          categories={categories || []}
          isOpen={isAdminOpen}
          onClose={onCloseAdmin}
          onDelete={() => {
            onOpenDelete();
          }}
          onSave={mutateFood}
          isDeleting={isLoading}
          isSaving={isSaving}
        />
        <FoodDeleteModal
          isOpen={isDeleteOpen}
          onClose={onCloseDelete}
          pendingFood={editedFood}
          onSubmit={async () => {
            if (editedFood) {
              onCloseDelete();
              return onDeleteFood(editedFood);
            }
            return Promise.reject();
          }}
        />
        <Button
          aria-label={"agregar comida"}
          leftIcon={<MdAdd />}
          style={{
            position: "fixed",
            bottom: "1.5em",
            right: "1.5em",
          }}
          colorScheme={"orange"}
          onClick={() => {
            setEditedFood(null);
            onOpenAdmin();
          }}
        >
          Agregar plato
        </Button>
      </VStack>
    </>
  );
}

export default AdminMenuPage;

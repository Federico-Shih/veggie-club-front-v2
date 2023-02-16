import { useCategories } from "@components/containers/menu/menu.hooks";
import { Button, Center, CircularProgress, Grid, GridItem, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { v4 as uuid } from "uuid";
import mime2ext from "mime2ext";

import TagList from "@components/containers/categories/TagList";
import { useCallback, useState } from "react";
import { useAdminFoods, useDeleteFood, useSaveFood } from "@components/containers/admin/menu/admin.hooks";
import FoodCard from "@components/containers/food/FoodCard";
import FoodAdminModal from "@components/containers/food/FoodAdminModal";
import { Food, FoodDTO } from "@/domain/foods";
import { uploadImage } from "@/api-functions/admin/admin.mutation";
import { useTranslation } from "next-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import FoodDeleteModal from "@components/containers/food/FoodDeleteModal";
import NoResults from "@components/containers/global/NoResults";

function AdminMenuPage() {
  const { isOpen: isAdminOpen, onOpen: onOpenAdmin, onClose: onCloseAdmin } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const { t } = useTranslation();
  const toast = useToast();
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
  const { mutate: mutateFood } = useSaveFood({ setEditedFood });
  const { mutate: onDeleteFood, isLoading } = useDeleteFood(onCloseAdmin);

  // Ver forma de integrar esto al mutate.
  const onSaveFood = useCallback(async (food: FoodDTO) => {
    if (!editedFood?.id || food.imageSource instanceof Blob) {
      // upload Image
      let imageToUpload: Blob;
      if (food.imageSource === "") {
        const emptyImage = await fetch("/empty.jpg");
        imageToUpload = await emptyImage.blob();
      } else {
        imageToUpload = food.imageSource as Blob;
      }
      let identifier = uuid();
      if (editedFood?.imageSource) {
        identifier = editedFood.imageSource.split(".")[0];
      }
      try {
        await uploadImage(imageToUpload, `${identifier}.${mime2ext(imageToUpload.type)}`);
      } catch (err) {
        toast({
          title: t("admin.edit.save.error.image"),
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      food.imageSource = `${identifier}.webp`;
    }
    await mutateFood(food);
  }, [editedFood?.id, editedFood?.imageSource, mutateFood, t, toast]);
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
          style={{ overflow: "hidden" }}
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
          onSave={onSaveFood}
          isDeleting={isLoading}
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

import { useCategories } from "@components/containers/menu/menu.hooks";
import { Button, Container, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { Category } from "@/domain/categories";
import { useDeleteCategory, useSaveCategory } from "@components/containers/admin/menu/admin.hooks";
import { MdAdd } from "react-icons/md";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/modal";
import dynamic from "next/dynamic";

const CategoryAdd = dynamic(() => import("@components/containers/categories/category/CategoryAdd"), { ssr: false });
const CategoryEdit = dynamic(() => import("@components/containers/categories/category/CategoryEdit"), { ssr: false });

interface MutableCategoryProps {
  category: Category;
  onDelete: (category: Category) => void;
}

function MutableCategoryEdit({ category, onDelete }: MutableCategoryProps) {
  const { mutate: onSaveCategory, isLoading } = useSaveCategory(() => {
  });
  return (
    <CategoryEdit
      category={category}
      onSave={onSaveCategory}
      onDelete={onDelete}
      isLoading={isLoading}
    />
  );
}

function CategoryEditPage() {
  const {
    isOpen: isDeletingOpen,
    onOpen: onDeletingOpen,
    onClose: onDeletingClose,
  } = useDisclosure();
  const {
    isOpen: isAddingOpen,
    onOpen: onAddingOpen,
    onClose: onAddingClose,
  } = useDisclosure();

  const { t } = useTranslation();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [deletingCategory, setDeleting] = useState<Category | null>(null);

  const { data, isLoading } = useCategories();
  const { mutate: onSaveCategory, isLoading: isAddLoading } = useSaveCategory(onAddingClose);
  const { mutate: onDeleteCategory, isLoading: isDeleteLoading } = useDeleteCategory(onDeletingClose);

  return (
    <Container>
      <Grid flexWrap={"wrap"} templateColumns={"repeat(2, 1fr)"} gap={1}>
        {
          !isLoading && (
            data?.map((category) => (
              <GridItem
                key={category.id}
                style={{ width: "100%" }}
              >
                <MutableCategoryEdit
                  category={category}
                  onDelete={(category) => {
                    setDeleting(category);
                    onDeletingOpen();
                  }}
                />
              </GridItem>
            ))
          )
        }
      </Grid>
      <Button
        aria-label={"agregar category"}
        leftIcon={<MdAdd />}
        style={{
          position: "fixed",
          bottom: "1.5em",
          right: "1.5em",
        }}
        colorScheme={"orange"}
        onClick={onAddingOpen}
      >
        {t("admin.category.add")}
      </Button>
      <CategoryAdd
        isLoading={isAddLoading}
        isOpen={isAddingOpen}
        onClose={onAddingClose}
        onSubmit={
          async (categoryDTO) => {
            await onSaveCategory(categoryDTO);
          }}
      />
      <AlertDialog
        isOpen={isDeletingOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeletingClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("admin.category.delete.title")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t("admin.category.delete.description").replace("%", deletingCategory?.name || "")}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeletingClose}>
                {t("admin.category.delete.cancel")}
              </Button>
              <Button
                colorScheme="red"
                onClick={
                  () => {
                    if (deletingCategory) {
                      onDeleteCategory(deletingCategory);
                    }
                  }
                }
                ml={3}
                isLoading={isDeleteLoading}
                disabled={isDeleteLoading}
              >
                {t("admin.category.delete.delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}

export default CategoryEditPage;

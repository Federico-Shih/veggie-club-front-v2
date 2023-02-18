import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { getAllFoods } from "@/api-functions/menu/menu.query";
import {
  deleteImage,
  removeCategory,
  removeFood,
  saveCategory,
  saveFood,
  uploadImage,
} from "@/api-functions/admin/admin.mutation";
import { AxiosError } from "axios";
import { Food, FoodDTO } from "@/domain/foods";
import { useTranslation } from "next-i18next";
import { useToast } from "@chakra-ui/react";
import useAuth from "@components/containers/auth/useAuth";
import { Category } from "@/domain/categories";
import { v4 as uuid } from "uuid";
import mime2ext from "mime2ext";
import { FirebaseError } from "@firebase/app";


export const useAdminFoods = (categoryId: string, limit: 16) => {
  const { refreshToken } = useAuth();
  return useInfiniteQuery(["admin", "food", categoryId], (context) => {
    return getAllFoods(context.queryKey[2] ? context.queryKey[2] : undefined, context.pageParam, limit);
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    onError: async (err) => {
      if (err instanceof AxiosError && err.response?.status === 401) {
        await refreshToken();
      }
    },
  });
};

interface IProps {
  setEditedFood: (food: Food | null) => void;
}

// TODO: use mutation result to modify current queryclient data
export const useSaveFood = ({ setEditedFood }: IProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ foodDTO, prevFood }: { foodDTO: FoodDTO, prevFood: Food | null }) => {
      if (foodDTO.imageSource instanceof Blob) {
        // upload Image
        let imageToUpload: Blob = foodDTO.imageSource as Blob;
        let identifier = uuid();
        if (prevFood?.imageSource) {
          identifier = prevFood.imageSource.split(".")[0];
        }
        await uploadImage(imageToUpload, `${identifier}.${mime2ext(imageToUpload.type)}`);
        foodDTO.imageSource = `${identifier}.webp`;
      }
      return saveFood(foodDTO);
    },
    onSuccess: async (result) => {
      setEditedFood(result);
      await queryClient.invalidateQueries(["admin", "food"]);
      await queryClient.invalidateQueries(["food"]);
      toast({
        title: t("admin.edit.save.success.title"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: async (error) => {
      if (error instanceof FirebaseError) {
        toast({
          title: t("admin.edit.save.error.image"),
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: t("admin.edit.save.error.title"),
        description: t("admin.edit.save.error.generic-error"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

export const useDeleteFood = (onCloseModal: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();
  return useMutation({
    mutationFn: async (food: Food) => {
      await deleteImage(food.imageSource);
      return removeFood(food);
    },
    onSuccess: async (_, deleted) => {
      await queryClient.invalidateQueries(["admin", "food"]);
      await queryClient.invalidateQueries(["food"]);
      onCloseModal();
      toast({
        title: t("admin.delete.success"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    onError: (error) => {
      if (error instanceof FirebaseError) {
        toast({
          title: t("admin.delete.error.image"),
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: t("admin.delete.error.generic-error"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });
};

export const useSaveCategory = (onSuccessClose: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();
  const auth = useAuth();
  return useMutation({
    mutationFn: saveCategory,
    onSuccess: async (category) => {
      onSuccessClose();
      queryClient.setQueryData("category", (prev: Category[] | undefined) => {
        if (prev) {
          const index = prev.findIndex((cat) => (cat.id === category.id));
          if (index === -1) {
            return [...prev, category];
          }
          return [...prev.slice(0, index), category, ...prev.slice(index + 1)];
        }
        return [category];
      });
      toast({
        title: t("admin.category.save.success"),
        status: "success",
        duration: 2000,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        auth.refreshToken();
      } else {
        toast({
          title: t("admin.category.save.error"),
          status: "error",
          duration: 2000,
        });
      }
    },
  });
};

export const useDeleteCategory = (onCloseModal: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();
  return useMutation(
    {
      mutationFn: removeCategory,
      onSuccess: async (data, category) => {
        queryClient.setQueryData("category", (prev: Category[] | undefined) => {
          return prev?.filter((value) => value.id !== category.id) || [];
        });
        toast({
          title: t("admin.category.delete.success"),
          status: "success",
          duration: 2000,
        });
        onCloseModal();
      },
      onError: () => {
        toast({
          title: t("admin.category.delete.error"),
          status: "error",
          duration: 2000,
        });
      },
    },
  );
};

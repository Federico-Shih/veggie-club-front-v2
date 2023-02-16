import { deleteObject, getStorage, ref, uploadBytes } from "@firebase/storage";
import { Food, FoodDTO } from "@/domain/foods";
import { authAxios } from "@/config/axios-config";
import { Category, CategoryDTO } from "@/domain/categories";

const storage = getStorage();

export const uploadImage = (image: Blob, filename: string) => {
  const fileRef = ref(storage, filename);
  return uploadBytes(fileRef, image);
};

export const deleteImage = (filename: string) => {
  const fileRef = ref(storage, filename);
  return deleteObject(fileRef);
};

export const saveFood = async ({ id, ...foodDto }: FoodDTO): Promise<Food> => {
  let route = "/api/food";
  if (id) {
    route = `${route}/${id}`;
  }
  const { data } = await authAxios.post<Food>(route, foodDto);
  return data;
};

export const removeFood = async ({ id }: Food): Promise<void> => {
  return authAxios.delete(`/api/food/${id}`);
};

export const saveCategory = async ({ id, ...categoryDTO }: CategoryDTO): Promise<Category> => {
  let route = "/api/category";
  if (id) {
    route = `${route}/${id}`;
  }
  const { data } = await authAxios.post<Food>(route, categoryDTO);
  return data;
};

export const removeCategory = async ({ id }: Category): Promise<void> => {
  return authAxios.delete(`/api/category/${id}`);
};

import { Category } from "@/domain/categories";
import axios from "axios";
import { Food, Paginated } from "@/domain/foods";
import { authAxios } from "@/config/axios-config";

const getCategoriesBase = async (baseURL: string): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>(`${baseURL}/category`);
  return data;
};

export const getCategories = () => {
  return getCategoriesBase("/api");
};

export const getCategoriesSSR = () => {
  return getCategoriesBase(process.env.BACKEND_URL || "");
};

interface FoodSearchDTO {
  weekday?: number;
  cursor?: string;
  limit?: number;
  category?: string;
}

export const getFoods = async ({ weekday, cursor, limit, category }: FoodSearchDTO): Promise<Paginated<Food>> => {
  const urlParams = new URLSearchParams();
  if (category) {
    urlParams.append("category", category);
  }
  if (category === undefined && weekday !== undefined) {
    urlParams.append("weekday", weekday.toString());
  }
  urlParams.append("cursor", (cursor || 0).toString());
  if (limit) {
    urlParams.append("limit", limit.toString());
  }
  const { data } = await axios.get<Paginated<Food>>(`/api/food?${urlParams}`);
  return data;
};

const getAllFoodsBase = async (baseURL: string, category?: string, cursor?: string, limit?: number): Promise<Paginated<Food>> => {
  const urlParams = new URLSearchParams();
  if (category) {
    urlParams.append("category", category);
  }
  if (cursor) {
    urlParams.append("cursor", cursor);
  }
  if (limit) {
    urlParams.append("limit", limit.toString());
  }
  const { data } = await authAxios.get<Paginated<Food>>(`${baseURL}/food/all?${urlParams}`);
  return data;
};

export const getAllFoods = (category?: string, cursor?: string, limit?: number) => {
  return getAllFoodsBase("/api", category, cursor, limit);
};

export const getAllFoodsSSR = (category?: string, cursor?: string, limit?: number) => {
  return getAllFoodsBase(process.env.BACKEND_URL || "", category, cursor, limit);
};

import { Category } from "@/domain/categories";
import axios from "axios";
import { Food, Paginated } from "@/domain/foods";
import { authAxios } from "@/config/axios-config";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>("/api/category");
  return data;
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

export const getAllFoods = async (category?: string, cursor?: number, limit?: number): Promise<Paginated<Food>> => {
  const urlParams = new URLSearchParams();
  if (category) {
    urlParams.append("category", category);
  }
  if (cursor) {
    urlParams.append("cursor", cursor.toString());
  }
  if (limit) {
    urlParams.append("limit", limit.toString());
  }
  const { data } = await authAxios.get<Paginated<Food>>(`/api/food/all?${urlParams}`);
  return data;
};


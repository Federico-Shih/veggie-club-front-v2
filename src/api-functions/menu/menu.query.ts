import { Category } from "@/domain/categories";
import axios from "axios";
import { Food } from "@/domain/foods";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>("/api/category");
  return data;
};

export const getFoods = async (weekday: number): Promise<Food[]> => {
  const { data } = await axios.get<Food[]>(`/api/food?weekday=${weekday}`);
  return data;
};

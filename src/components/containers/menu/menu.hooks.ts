import { useQuery } from "react-query";
import { getCategories, getFoods } from "@/api-functions/menu/menu.query";

export const useCategories = () => {
  return useQuery("category", getCategories);
};

export const useFoods = (weekday: number) => {
  return useQuery(["food", weekday], (query) => getFoods(query.queryKey[1] as number));
};

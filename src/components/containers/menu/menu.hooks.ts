import { useQuery } from "react-query";
import { getCategories, getFoods } from "@/api-functions/menu/menu.query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Food, Paginated } from "@/domain/foods";

export const useCategories = () => {
  return useQuery("category", getCategories);
};

// Firebase does not allow multiple array contains, to circumvent this,
// I'll apply this logic:
// if not filtering by category, filter by day (call)
// if filtering by category, calls it without pagination, so it can apply quickly the day filter
export const useFoods = (limit: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredCategory, setCategory] = useState("");
  const [filteredDay, setDay] = useState(new Date().getDay());
  const [data, setData] = useState<Food[]>([]);
  const [paginatedData, setPaginatedData] = useState<Paginated<Food> | null>(null);

  const fetchPage = useCallback(async (cursor: string | undefined, limit: number, weekday: number, reset: boolean) => {
    setLoading(true);
    try {
      const result = await getFoods({ weekday: weekday, cursor, limit });
      setPaginatedData((prev) => {
        const previous = (!reset) ? (prev?.data || []) : [];
        return ({
          ...
            result, data: [...previous, ...result.data],
        });
      });
    } catch (err) {
      setError("error.unknown");
    }
    setLoading(false);
  }, []);

  const fetchNextPage = async () => {
    await fetchPage(paginatedData?.nextCursor, paginatedData?.limit || limit, filteredDay, false);
  };

  const switchCategories = async (categoryId: string) => {
    setCategory(categoryId);
    if (categoryId.length !== 0) {
      setLoading(true);
      try {
        const result = await getFoods({ category: categoryId });
        setData(result.data);
      } catch (e) {
        setError("error.unknown");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(undefined, limit, filteredDay, true);
  }, [fetchPage, filteredDay, limit]);

  const filteredDayData = useMemo(
    () => data.filter(
      (food) => food.weekdays.some(
        (day) => day === filteredDay),
    ),
    [data, filteredDay]);
  const { data: _, ...pagination } = paginatedData || { data: [], nextCursor: 0 };
  return {
    values: {
      category: filteredCategory,
      shownDay: filteredDay,
      data: filteredCategory.length === 0 ? (paginatedData?.data || []) : filteredDayData,
      error,
      isError: error.length !== 0,
      loading,
      pagination,
    },
    actions: {
      switchCategories,
      fetchNextPage,
      setDay,
    },
  };
};

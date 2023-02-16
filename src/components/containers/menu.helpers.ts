import { Category } from "@/domain/categories";

export function getImageUrl(imageId: string) {
  return `${process.env.NEXT_PUBLIC_IMAGE_HOST}/${imageId}?alt=media`;
}

export function mapCategories(categories: Category[]) {
  const mapper = new Map<string, Category>();
  categories.forEach((category) => {
    mapper.set(category.id, category);
  });
  return mapper;
}

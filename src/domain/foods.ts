export interface FoodDB {
  name: string;
  description: string;
  imageSource: string;
  categories: string[];
  timestamp: Date;
  weekdays: number[];
  active: boolean;
}

export interface Food extends FoodDB {
  id: string;
}

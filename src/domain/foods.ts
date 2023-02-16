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

export interface FoodDTO {
  name: string;
  description: string;
  imageSource: string | Blob;
  categories: string[];
  id?: string;
  active: boolean;
  weekdays: number[];
}

export class Paginated<T> {
  data: T[];
  nextCursor: string | undefined;
  cursor: string;
  limit: number;

  constructor(
    data: T[],
    cursor: string,
    limit: number,
    nextCursor: string | undefined = undefined,
  ) {
    this.data = data;
    this.cursor = cursor;
    this.limit = limit;
    this.nextCursor = nextCursor;
  }
}

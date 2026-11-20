export type Category = 'sweet' | 'savory' | 'silly'

export const CATEGORIES: readonly Category[] = ['sweet', 'silly', 'savory']

export interface Topping {
  id: string
  name: string
  tags: Category[]
}

export interface Pick {
  topping: Topping
  /** The category this topping was drawn for (decides its color). */
  category: Category
}

export const MIN_COUNT = 1
export const MAX_COUNT = 8
export const DEFAULT_COUNT = 3

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  genre: string;
  rating: number;
  reviewCount: number;
  isbn: string;
  publisher: string;
  publishedDate: string;
  pages: number;
  language: string;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  tags?: string[];
}

export interface Review {
  id: number;
  bookId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

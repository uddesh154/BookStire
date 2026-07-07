import { Book } from './book.model';

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

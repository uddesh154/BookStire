import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { Cart, CartItem } from '../models/cart.model';

const TAX_RATE = 0.08;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart$ = new BehaviorSubject<Cart>(this.getEmptyCart());

  constructor() {
    this.loadCartFromStorage();
  }

  getCart(): Observable<Cart> {
    return this.cart$.asObservable();
  }

  getCartSnapshot(): Cart {
    return this.cart$.getValue();
  }

  addToCart(book: Book, quantity = 1): void {
    const cart = { ...this.cart$.getValue() };
    const existingItem = cart.items.find((i) => i.book.id === book.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items = [...cart.items, { book, quantity }];
    }

    this.updateCart(cart);
  }

  removeFromCart(bookId: number): void {
    const cart = { ...this.cart$.getValue() };
    cart.items = cart.items.filter((i) => i.book.id !== bookId);
    this.updateCart(cart);
  }

  updateQuantity(bookId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(bookId);
      return;
    }
    const cart = { ...this.cart$.getValue() };
    const item = cart.items.find((i) => i.book.id === bookId);
    if (item) {
      item.quantity = quantity;
      this.updateCart(cart);
    }
  }

  clearCart(): void {
    const empty = this.getEmptyCart();
    this.cart$.next(empty);
    localStorage.removeItem('bs_cart');
  }

  isInCart(bookId: number): boolean {
    return this.cart$.getValue().items.some((i) => i.book.id === bookId);
  }

  private updateCart(cart: Cart): void {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const discount = cart.items.reduce((sum, item) => {
      const orig = item.book.originalPrice ?? item.book.price;
      return sum + (orig - item.book.price) * item.quantity;
    }, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const updatedCart: Cart = { ...cart, subtotal, discount, tax, total, totalItems };
    this.cart$.next(updatedCart);
    localStorage.setItem('bs_cart', JSON.stringify(updatedCart));
  }

  private loadCartFromStorage(): void {
    const stored = localStorage.getItem('bs_cart');
    if (stored) {
      try {
        const cart: Cart = JSON.parse(stored);
        this.cart$.next(cart);
      } catch {
        this.cart$.next(this.getEmptyCart());
      }
    }
  }

  private getEmptyCart(): Cart {
    return { items: [], totalItems: 0, subtotal: 0, discount: 0, tax: 0, total: 0 };
  }
}

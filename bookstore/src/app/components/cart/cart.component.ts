import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
// _base.ts is not needed — navigate helper is inline

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cart!: Cart;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => (this.cart = cart));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(bookId: number, quantity: number): void {
    this.cartService.updateQuantity(bookId, quantity);
  }

  removeItem(bookId: number): void {
    this.cartService.removeFromCart(bookId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
